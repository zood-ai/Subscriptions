'use client';

import * as React from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

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
  data: T[];
  columns: Column<T>[];
  filters?: FilterTab[];
  actions?: ActionOption[];
  title?: string;
  onClickRow?: (data: T) => void;
  onFilterChange?: (filter: string) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function CustomTable<T extends { id: string }>({
  data,
  columns,
  filters,
  actions,
  onClickRow,
  title,
  onFilterChange,
  onSelectionChange,
}: CustomTableProps<T>) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [activeFilter, setActiveFilter] = React.useState(
    filters?.[0]?.value || 'all'
  );

  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const someSelected =
    selectedIds.length > 0 && selectedIds.length < data.length;
  const hasSelection = selectedIds.length > 0;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
      onSelectionChange?.([]);
    } else {
      const allIds = data.map((item) => item.id);
      setSelectedIds(allIds);
      onSelectionChange?.(allIds);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id];
      onSelectionChange?.(newSelection);
      return newSelection;
    });
  };

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
    onFilterChange?.(value);
  };

  return (
    <div>
      {title && (
        <h2 className="py-[25px] text-gray-500 text-xl font-medium">{title}</h2>
      )}
      {data.length > 0 ? (
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
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
                {data.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="w-12 px-4 py-4">
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={() => handleSelectRow(item.id)}
                        className="h-4 w-4"
                      />
                    </td>
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className="px-4 py-4 text-sm text-foreground"
                        onClick={() => onClickRow?.(item)}
                      >
                        {column.render
                          ? column.render(item[column.key], item)
                          : String(item[column.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 font-medium flex justify-center items-center p-[50px] w-full rounded-2xl border border-border bg-card">
          No data to display
        </div>
      )}
    </div>
  );
}
