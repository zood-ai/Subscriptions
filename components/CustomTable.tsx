'use client';

import type React from 'react';
import { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import TableSkeleton from './TableSkeleton';
import type { MetaData } from '@/types/global';
import useCustomQuery from '@/lib/Query';
import CustomModal from './layout/CustomModal';

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

interface WithData<T> {
  data: T[];
  endPoint?: never;
}

interface WithEndPoint {
  data?: never;
  endPoint: string;
}
interface BaseProps<T extends { id: string }> {
  showFilters?: boolean;
  columns: Column<T>[];
  filterKey?: string;
  filters?: FilterTab[];
  actions?: ActionOption[];
  title?: string;
  onClickRow?: (data: T) => void;
  pagination?: boolean;
}

type CustomTableProps<T extends { id: string }> = BaseProps<T> &
  (WithData<T> | WithEndPoint);

export function CustomTable<T extends { id: string }>({
  data = [],
  endPoint = '',
  showFilters = true,
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
  const [paginationData, setPaginationData] = useState<MetaData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allFilters, setAllFilters] = useState<
    Record<string, number | string | boolean>
  >({ page: 1 });
  const { data: allData = { data }, isLoading } = useCustomQuery<{
    data: T[];
    from: MetaData['from'];
    last_page: MetaData['last_page'];
    to: MetaData['to'];
    total: MetaData['total'];
  }>({
    api: endPoint || '',
    enabled: endPoint && data.length === 0 ? true : false,
    filters: allFilters,
    queryKey: [endPoint, allFilters],
    options: {
      onSuccess: (data) => {
        setPaginationData({
          from: data.from,
          last_page: data.last_page,
          to: data.to,
          total: data.total,
        });
      },
    },
  });

  const allSelected =
    allData?.data?.length > 0 && selectedIds.length === allData?.data?.length;
  const someSelected =
    selectedIds.length > 0 && selectedIds.length < allData?.data?.length;
  const hasSelection = selectedIds.length > 0;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      const allIds = allData?.data?.map((item) => item.id);
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

  if (isLoading) {
    return <TableSkeleton title={title} />;
  }

  return (
    <div>
      {title && (
        <h2 className="py-[25px] text-gray-500 text-xl font-medium">{title}</h2>
      )}
      {allData?.data?.length > 0 ? (
        <div className="w-full rounded-2xl border border-border bg-card">
          {/* Filter Tabs Row */}
          {(showFilters || (filters && filters?.length > 0)) && (
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
              {showFilters && (
                <CustomModal
                  title={`Filters`}
                  btnTrigger={
                    <button className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-full border border-border hover:bg-muted transition-colors">
                      <Filter className="h-4 w-4" />
                      Filter
                    </button>
                  }
                >
                  Filter Component Here
                </CustomModal>
              )}
            </div>
          )}
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
                      className="px-4 py-3 text-nowrap text-left text-sm font-semibold text-foreground"
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allData?.data?.map((item) => (
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
                        className="px-4 py-4 text-sm text-foreground cursor-pointer"
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
