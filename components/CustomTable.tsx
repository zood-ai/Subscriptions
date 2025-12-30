'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';
import TableSkeleton from './TableSkeleton';
import type { MetaData } from '@/types/global';

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

export interface FilterTab {
  label: string;
  value: string;
}

export interface ActionOption {
  label: string;
  onClick: (selectedItems: string[]) => void;
}

interface CustomTableProps<T extends { id: string }> {
  data?: T[];
  endPoint?: string;
  columns: Column<T>[];
  filterKey?: string;
  filters?: FilterTab[];
  actions?: ActionOption[];
  title?: string;
  onClickRow?: (data: T) => void;
  pagination?: boolean;
}

export function CustomTable<T extends { id: string }>({
  data = [],
  endPoint = '',
  filterKey = 'status',
  columns,
  filters,
  actions,
  onClickRow,
  title,
  pagination = true,
}: CustomTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState(
    filters?.[0]?.value || 'all'
  );
  const [allData, setAllData] = useState<T[]>(data ?? []);
  const [Loading, setLoading] = useState<boolean>(true);
  const [paginationData, setPaginationData] = useState<MetaData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [allFilters, setAllFilters] = useState<
    Record<string, number | string | boolean>
  >({ page: 1 });

  const allSelected =
    allData.length > 0 && selectedIds.length === allData.length;
  const someSelected =
    selectedIds.length > 0 && selectedIds.length < allData.length;
  const hasSelection = selectedIds.length > 0;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      const allIds = allData.map((item) => item.id);
      setSelectedIds(allIds);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id];
      return newSelection;
    });
  };

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
    setAllFilters((prev) => ({
      ...prev,
      [filterKey]: value,
      page: 1,
    }));
    setCurrentPage(1);
  };

  const goToPage = (pageNumber: number) => {
    if (currentPage === pageNumber) return;
    setCurrentPage(pageNumber);
    setAllFilters((prev) => ({
      ...prev,
      page: pageNumber,
    }));
  };

  useEffect(() => {
    if (!(endPoint && data.length === 0)) return;
    const fn = async () => {
      setLoading(true);
      const queryParams = new URLSearchParams();
      Object.entries(allFilters).forEach(([key, value]) => {
        if (value != null) {
          queryParams.append(key, String(value));
        }
      });
      try {
        const res: {
          data: {
            data: T[];
            meta: MetaData;
          };
        } = await axios.get(
          `${endPoint}${
            queryParams.toString() ? `?${queryParams.toString()}` : ''
          }`
        );

        setAllData(res?.data?.data);
        setPaginationData(res?.data?.meta);
      } finally {
        setLoading(false);
      }
    };
    fn();
  }, [allFilters, data.length, endPoint]);

  if (Loading) {
    return <TableSkeleton title={title} />;
  }

  return (
    <div>
      {title && (
        <h2 className="py-[25px] text-gray-500 text-xl font-medium">{title}</h2>
      )}
      {allData.length > 0 ? (
        <div className="w-full rounded-2xl border border-border bg-card">
          {/* Filter Tabs Row */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              {filters?.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => handleFilterChange(filter.value)}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-full transition-colors',
                    activeFilter === filter.value
                      ? 'text-blue-600 bg-blue-50 border border-blue-200'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-full border border-border hover:bg-muted transition-colors">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
          {/* Selection Info Row */}
          {actions && actions?.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <span className="text-sm font-semibold text-foreground">
                {selectedIds.length} Selected
              </span>
              {hasSelection && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground bg-muted rounded-md hover:bg-muted/80 transition-colors">
                    Actions
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {actions?.map((action) => (
                      <DropdownMenuItem
                        key={action.label}
                        onClick={() => action.onClick(selectedIds)}
                      >
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {!hasSelection && (
                <div className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground/50 bg-muted/50 rounded-md cursor-not-allowed">
                  Actions
                  <ChevronDown className="h-4 w-4" />
                </div>
              )}
            </div>
          )}
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="w-12 px-4 py-3 text-left">
                    <div className="relative flex items-center justify-center">
                      {actions && actions?.length && (
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={handleSelectAll}
                          className={cn(
                            'h-4 w-4',
                            someSelected && 'data-[state=checked]:bg-primary'
                          )}
                          {...(someSelected && { 'data-state': 'checked' })}
                        />
                      )}
                      {someSelected && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="h-4 w-4 rounded-sm bg-primary flex items-center justify-center">
                            <div className="w-2 h-0.5 bg-primary-foreground rounded-full" />
                          </div>
                        </div>
                      )}
                    </div>
                  </th>
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className="px-4 py-3 text-left text-sm font-semibold text-foreground"
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="w-12 px-4 py-4">
                      {actions && actions?.length && (
                        <Checkbox
                          checked={selectedIds.includes(item.id)}
                          onCheckedChange={() => handleSelectRow(item.id)}
                          className="h-4 w-4"
                        />
                      )}
                    </td>
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className="px-4 py-4 text-sm text-foreground"
                        onClick={() => onClickRow?.(item)}
                      >
                        {column.render
                          ? column.render(item[column.key], item)
                          : String(item[column.key] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination && paginationData && (
            <div className="flex justify-end items-center space-x-[19px] mx-[20px] mt-[30px] mb-[20px]">
              <div className="flex items-center justify-center text-gray-500 font-[12px]">
                {paginationData?.from} - {paginationData?.to} of{' '}
                {paginationData?.total}
              </div>
              <div className="flex justify-center items-center space-x-2 mx-3">
                {currentPage > 3 && (
                  <>
                    <button
                      onClick={() => goToPage(1)}
                      className="cursor-pointer px-3 py-1 rounded bg-gray-100"
                    >
                      1
                    </button>
                    {currentPage > 3 && <span>...</span>}
                  </>
                )}

                {Array.from({ length: 5 }, (_, i) => {
                  const pageNumber = currentPage - 2 + i;
                  if (
                    pageNumber > 0 &&
                    pageNumber <= paginationData?.last_page
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        className={`cursor-pointer px-3 py-1 rounded ${
                          currentPage === pageNumber
                            ? 'bg-primary text-white'
                            : 'bg-gray-100'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                  return null;
                })}

                {currentPage < paginationData?.last_page - 2 && (
                  <>
                    {currentPage < paginationData?.last_page - 3 && (
                      <span>...</span>
                    )}
                    <button
                      onClick={() => goToPage(paginationData?.last_page)}
                      className="cursor-pointer px-3 py-1 rounded bg-gray-100"
                    >
                      {paginationData?.last_page}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-gray-500 font-medium flex justify-center items-center p-[50px] w-full rounded-2xl border border-border bg-card">
          No data to display
        </div>
      )}
    </div>
  );
}
