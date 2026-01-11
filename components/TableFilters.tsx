import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export interface AllowedFilters {
  showName?: boolean;
}

interface TableFiltersProps {
  filters: AllowedFilters;
  data: Record<string, number | string | boolean>;
  onSubmit: (data: Record<string, number | string | boolean>) => void;
}

const TableFilters = ({ filters = {}, data, onSubmit }: TableFiltersProps) => {
  const [allFilters, setAllFilters] = useState<
    Record<string, number | string | boolean>
  >({ page: 1 });

  const handleChnage = (filed: string, value: number | string | boolean) => {
    setAllFilters((prev) => ({
      ...prev,
      [filed]: value,
    }));
  };

  useEffect(() => {
    setAllFilters(data);
  }, [data]);

  return (
    <div>
      {filters.showName && (
        <Input
          type="text"
          Label="Name"
          value={(allFilters?.name as string) ?? ''}
          onChange={(e) => handleChnage('name', e.target.value)}
        />
      )}
      <div className="flex items-center flex-row-reverse mt-3 relative justify-between gap-3 pt-4 border-t border-gray-200">
        <Button
          onClick={() => {
            onSubmit(allFilters);
          }}
          type="button"
          className="bg-primary hover:bg-primary/80 text-white rounded-full px-8"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default TableFilters;
