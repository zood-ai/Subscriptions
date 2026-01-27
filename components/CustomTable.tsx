'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import {
  ChevronDown,
  Filter,
  X,
  ArrowUpDown,
  Download,
  Upload,
} from 'lucide-react';
import { cn, formatDate, ObjectCleaner } from '@/lib/utils';
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
import useCustomMutation from '@/lib/Mutation';
import CustomModal from './layout/CustomModal';
import TableFilters, { AllowedFilters } from './TableFilters';
import toast from 'react-hot-toast';

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

export interface SortOption {
  label: string;
  value: string;
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
  onClickRow?: (data: T) => void;
  pagination?: boolean;
  showExport?: boolean;
  showImport?: boolean;
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
}: CustomTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [paginationData, setPaginationData] = useState<MetaData | null>(null);
  const [allFilters, setAllFilters] = useState<
    Record<string, number | string | boolean>
  >({ page: 1, sort: 'desc', [statusFilterKey]: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPage = allFilters.page as number;
  const sortOptions: SortOption[] = [
    { label: 'Descending', value: 'desc' },
    { label: 'Ascending', value: 'asc' },
  ];

  // Export Mutation
  const { mutateAsync: exportData, isPending: isExporting } = useCustomMutation<
    Record<string, number | string | boolean>,
    Blob
  >({
    api: `${endPoint}/export`,
    method: 'POST',
    options: {
      onSuccess: (data) => {
        // Create download link
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
    },
  });

  // Import Mutation
  const { mutateAsync: importData, isPending: isImporting } =
    useCustomMutation<FormData>({
      api: `${endPoint}/import`,
      method: 'POST',
      options: {
        onSuccess: () => {
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        },
      },
    });

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

  const handleFilterChange = (value: string) => {
    setAllFilters((prev) => ({
      ...prev,
      [statusFilterKey]: value,
      page: 1,
    }));
  };

  const goToPage = (pageNumber: number) => {
    if (currentPage === pageNumber) return;
    setAllFilters((prev) => ({
      ...prev,
      page: pageNumber,
    }));
  };

  const handleExport = () => {
    if (!endPoint) return;
    toast.promise(exportData(ObjectCleaner(allFilters)), {
      loading: 'Preparing export...',
      success: 'Export completed successfully ✅',
      error: 'Failed to export data',
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !endPoint) return;

    const formData = new FormData();
    formData.append('file', file);

    toast.promise(importData(formData), {
      loading: 'Submitting import request...',
      success:
        'Import started. Data will appear once processing is complete ⏳',
      error: 'Failed to import',
    });
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
      {allData?.data?.length > 0 ? (
        <div className="w-full rounded-2xl border border-border bg-card">
          {/* Filter Tabs Row */}
          {(showStatusFilters ||
            (statusFilters && statusFilters?.length > 0)) && (
            <div className="flex flex-wrap gap-y-2 items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex flex-wrap items-center gap-2">
                {[{ label: 'All', value: '' }, ...statusFilters]?.map(
                  (filter) => (
                    <button
                      key={filter.value}
                      onClick={() => handleFilterChange(filter.value)}
                      className={cn(
                        'px-3 py-1.5 text-sm font-medium rounded-full transition-colors',
                        allFilters[statusFilterKey] === filter.value
                          ? 'text-blue-600 bg-blue-50 border border-blue-200'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      {filter.label}
                    </button>
                  )
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {endPoint && sortOptions && sortOptions.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-full border border-border hover:bg-muted transition-colors">
                      <ArrowUpDown className="h-4 w-4" />
                      Sort
                      <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {sortOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() =>
                            setAllFilters((prev) => ({
                              ...prev,
                              sort: option.value,
                              page: 1,
                            }))
                          }
                          className={cn(
                            allFilters['sort'] === option.value && 'bg-muted'
                          )}
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                {showExport && endPoint && (
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full border border-border transition-colors',
                      isExporting
                        ? 'text-muted-foreground bg-muted cursor-not-allowed opacity-50'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <Download className="h-4 w-4" />
                    {isExporting ? 'Exporting...' : 'Export'}
                  </button>
                )}
                {showImport && endPoint && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      onClick={handleImportClick}
                      disabled={isImporting}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full border border-border transition-colors',
                        isImporting
                          ? 'text-muted-foreground bg-muted cursor-not-allowed opacity-50'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      <Upload className="h-4 w-4" />
                      {isImporting ? 'Importing...' : 'Import'}
                    </button>
                  </>
                )}
                {showStatusFilters && (
                  <CustomModal
                    title="Filters"
                    btnTrigger={
                      <button className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-full border border-border hover:bg-muted transition-colors">
                        <Filter className="h-4 w-4" />
                        Filter
                        {Object.entries(allFilters).length > 3 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setAllFilters((prev) => ({
                                page: 1,
                                sort: prev.sort ?? 'desc',
                                [statusFilterKey]: '',
                              }));
                            }}
                            className="bg-gray-100 cursor-pointer rounded-full p-1"
                          >
                            <X size={15} />
                          </button>
                        )}
                      </button>
                    }
                  >
                    <TableFilters
                      filters={filters}
                      data={allFilters}
                      onSubmit={(
                        data: Record<string, number | string | boolean>
                      ) => setAllFilters(data)}
                    />
                  </CustomModal>
                )}
              </div>
            </div>
          )}
          {/* Selection Info Row */}
          {actions.length > 0 && (
            <Actions actions={actions} selectedIds={selectedIds} />
          )}
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
                {allData?.data?.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    {actions.length > 0 && (
                      <td className="w-12 px-4 py-4">
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
                        className="px-4 py-4 text-sm text-foreground cursor-pointer"
                        onClick={() => onClickRow?.(item)}
                      >
                        {column.render
                          ? column.render(item[column.key], item)
                          : column.type === 'date' && item[column.key]
                            ? formatDate(new Date(item[column.key] as string))
                            : String(item[column.key] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))}
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
        </div>
      ) : (
        <div className="text-gray-500 font-medium flex justify-center items-center p-12.5 w-full rounded-2xl border border-border bg-card">
          No data to display
        </div>
      )}
    </div>
  );
}

const Pagination = ({
  paginationData,
  currentPage,
  goToPage,
}: {
  paginationData: MetaData;
  currentPage: number;
  goToPage: (pageNumber: number) => void;
}) => {
  return (
    <div className="flex justify-end items-center space-x-4.75 mx-5 mt-7.5 mb-5">
      <div className="flex items-center justify-center text-gray-500 font-[12px]">
        {paginationData?.from} - {paginationData?.to} of {paginationData?.total}
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
          if (pageNumber > 0 && pageNumber <= paginationData?.last_page) {
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
            {currentPage < paginationData?.last_page - 3 && <span>...</span>}
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
  );
};

const Actions = ({
  selectedIds,
  actions,
}: {
  selectedIds: string[];
  actions: ActionOption[];
}) => {
  const hasSelection = selectedIds.length > 0;

  return (
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
  );
};
