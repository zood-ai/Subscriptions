'use client';
import type React from 'react';
import { useState } from 'react';
import { cn, formatDate, ObjectCleaner } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import TableSkeleton from './table/TableSkeleton';
import type { MetaData } from '@/types/global';
import useCustomQuery from '@/lib/Query';
import { AllowedFilters } from './table/TableFilters';
import Pagination from './table/Pagination';
import Actions from './table/Actions';
import Filters from './table/Filters';
import { useRouter } from 'next/navigation';
import { useNavigationContext } from 'next-progressbar-link';

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  type?: 'date';
}

export interface StatusFiltersTab {
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
  showStatusFilters?: boolean;
  columns: Column<T>[];
  filters?: AllowedFilters;
  statusFilterKey?: string;
  statusFilters?: StatusFiltersTab[];
  forceLoading?: boolean;
  actions?: ActionOption[];
  title?: string;
  titleClassName?: string;
  onClickRow?: (data: T) => string;
  pagination?: boolean;
  showExport?: boolean;
  showImport?: boolean;
  exportEndPoint?: string;
  importEndPoint?: string;
}

type CustomTableProps<T extends { id: string }> = BaseProps<T> &
  (WithData<T> | WithEndPoint);

export function CustomTable<T extends { id: string }>({
  data = [],
  endPoint = '',
  showStatusFilters = true,
  statusFilterKey = 'status',
  forceLoading = false,
  columns,
  statusFilters = [],
  filters = {},
  actions = [],
  onClickRow,
  title,
  titleClassName = '',
  pagination = true,
  showExport = false,
  showImport = false,
  exportEndPoint = '',
  importEndPoint = '',
}: CustomTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [paginationData, setPaginationData] = useState<MetaData | null>(null);
  const [allFilters, setAllFilters] = useState<
    Record<string, number | string | boolean>
  >({ page: 1, sort: 'desc', [statusFilterKey]: '' });
  const currentPage = allFilters.page as number;
  const { setIsNavigating } = useNavigationContext();
  const router = useRouter();

  const { data: allData = { data }, isFetching: isLoading } = useCustomQuery<{
    data: T[];
    from: MetaData['from'];
    last_page: MetaData['last_page'];
    to: MetaData['to'];
    total: MetaData['total'];
    current_page: MetaData['current_page'];
  }>({
    api: endPoint || '',
    enabled: endPoint && data.length === 0 ? true : false,
    filters: ObjectCleaner(allFilters),
    queryKey: [endPoint, allFilters],
    options: {
      onSuccess: (data) => {
        setPaginationData({
          from: data.from,
          last_page: data.last_page,
          to: data.to,
          total: data.total,
          current_page: data.current_page,
        });
      },
    },
  });

  const allSelected =
    allData?.data?.length > 0 && selectedIds.length === allData?.data?.length;
  const someSelected =
    selectedIds.length > 0 && selectedIds.length < allData?.data?.length;

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

  const goToPage = (pageNumber: number) => {
    if (currentPage === pageNumber) return;
    setAllFilters((prev) => ({
      ...prev,
      page: pageNumber,
    }));
  };

  if (forceLoading || isLoading) {
    return <TableSkeleton titleClassName={titleClassName} title={title} />;
  }

  return (
    <div>
      {title && (
        <h2
          className={cn(
            'py-6.25 text-gray-500 text-xl font-medium',
            titleClassName
          )}
        >
          {title}
        </h2>
      )}
      <div className="w-full rounded-2xl border border-border bg-card">
        {/* Filter Tabs Row */}
        {(showStatusFilters ||
          (statusFilters && statusFilters?.length > 0)) && (
          <Filters
            statusFilters={statusFilters}
            filters={filters}
            allFilters={allFilters}
            setAllFilters={setAllFilters}
            statusFilterKey={statusFilterKey}
            endPoint={endPoint}
            showExport={showExport}
            showImport={showImport}
            exportEndPoint={exportEndPoint}
            importEndPoint={importEndPoint}
            showStatusFilters={showStatusFilters}
          />
        )}
        {/* Selection Info Row */}
        {actions.length > 0 && (
          <Actions actions={actions} selectedIds={selectedIds} />
        )}
        {allData?.data?.length > 0 ? (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {actions.length > 0 && (
                      <th className="w-12 px-4 py-3 text-left">
                        <div className="relative flex items-center justify-center">
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={handleSelectAll}
                            className={cn(
                              'h-4 w-4',
                              someSelected && 'data-[state=checked]:bg-primary'
                            )}
                            {...(someSelected && { 'data-state': 'checked' })}
                          />
                          {someSelected && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="h-4 w-4 rounded-sm bg-primary flex items-center justify-center">
                                <div className="w-2 h-0.5 bg-primary-foreground rounded-full" />
                              </div>
                            </div>
                          )}
                        </div>
                      </th>
                    )}
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
                  {allData?.data?.map((item) => {
                    return (
                      <tr
                        key={item.id}
                        onClick={async () => {
                          if (onClickRow) {
                            setIsNavigating(true);
                            router.push(onClickRow(item));
                          }
                        }}
                        className={`border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors ${
                          onClickRow ? 'cursor-pointer' : ''
                        }`}
                      >
                        {actions.length > 0 && (
                          <td
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="w-12 px-4 py-4"
                          >
                            <Checkbox
                              checked={selectedIds.includes(item.id)}
                              onCheckedChange={() => handleSelectRow(item.id)}
                              className="h-4 w-4"
                            />
                          </td>
                        )}
                        {columns.map((column) => (
                          <td
                            key={String(column.key)}
                            className="px-4 py-4 text-sm text-foreground"
                          >
                            {column.render
                              ? column.render(item[column.key], item)
                              : column.type === 'date' && item[column.key]
                                ? formatDate(
                                    new Date(item[column.key] as string)
                                  )
                                : String(item[column.key] ?? '-')}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {pagination && paginationData && (
              <Pagination
                paginationData={paginationData}
                currentPage={currentPage}
                goToPage={goToPage}
              />
            )}
          </>
        ) : (
          <div className="text-gray-500 font-medium flex justify-center items-center p-12.5 w-full rounded-2xl">
            No data to display
          </div>
        )}
      </div>
    </div>
  );
}
