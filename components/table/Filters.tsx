import {
  ChevronDown,
  Filter,
  X,
  ArrowUpDown,
  Download,
  Upload,
} from 'lucide-react';
import { cn, ObjectCleaner } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CustomModal from '@/components/layout/CustomModal';
import TableFilters, { AllowedFilters } from './TableFilters';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import useCustomMutation from '@/lib/Mutation';
import { StatusFiltersTab } from '../CustomTable';

interface SortOption {
  label: string;
  value: string;
}

const Filters = ({
  statusFilters = [],
  filters = {},
  allFilters,
  setAllFilters,
  statusFilterKey,
  endPoint,
  showExport,
  showImport,
  showStatusFilters,
  exportEndPoint = '',
  importEndPoint = '',
}: {
  statusFilters?: StatusFiltersTab[];
  filters?: AllowedFilters;
  allFilters: Record<string, number | string | string[] | boolean>;
  setAllFilters: React.Dispatch<
    React.SetStateAction<Record<string, number | string | string[] | boolean>>
  >;
  statusFilterKey: string;
  endPoint?: string;
  showExport?: boolean;
  showImport?: boolean;
  exportEndPoint?: string;
  importEndPoint?: string;
  showStatusFilters?: boolean;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sortOptions: SortOption[] = [
    { label: 'Descending', value: 'desc' },
    { label: 'Ascending', value: 'asc' },
  ];

  // Export Mutation
  const { mutateAsync: exportData, isPending: isExporting } = useCustomMutation<
    Record<string, number | string | string[] | boolean>,
    Blob
  >({
    api: exportEndPoint ? exportEndPoint : `${endPoint}/export`,
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
      api: importEndPoint ? importEndPoint : `${endPoint}/import`,
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

  const handleFilterChange = (value: string) => {
    setAllFilters((prev) => ({
      ...prev,
      [statusFilterKey]: value,
      page: 1,
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

  return (
    <div className="flex flex-wrap gap-y-2 items-center justify-between px-4 py-3 border-b border-border">
      <div className="flex flex-wrap items-center gap-2">
        {/* Status filters */}
        {[{ label: 'All', value: '' }, ...statusFilters]?.map((filter) => (
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
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {/* Sort */}
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

        {/* Export */}
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

        {/* Import */}
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

        {/* All filters */}
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
              onSubmit={(data: Record<string, number | string | string[] | boolean>) =>
                setAllFilters(data)
              }
            />
          </CustomModal>
        )}
      </div>
    </div>
  );
};

export default Filters;
