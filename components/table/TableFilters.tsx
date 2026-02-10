import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Select from '../Select';

export interface AllowedFilters {
  showName?: boolean;
  showReference?: boolean;
  showCode?: boolean;
  showIsUsed?: boolean;
  showEndAT?: true;
  showBusinessType?: true;
}

interface TableFiltersProps {
  filters: AllowedFilters;
  data: Record<string, number | string | boolean>;
  onSubmit: (data: Record<string, number | string | boolean>) => void;
}

const TableFilters = ({ filters = {}, data, onSubmit }: TableFiltersProps) => {
  const [allFilters, setAllFilters] = useState<
    Record<string, number | string | boolean>
  >({});

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
    <>
      <div className="space-y-4">
        {filters.showName && (
          <Input
            type="text"
            Label="Name"
            value={(allFilters?.name as string) ?? ''}
            onChange={(e) => handleChnage('name', e.target.value)}
          />
        )}
        {filters.showReference && (
          <Input
            type="text"
            Label="Reference"
            value={(allFilters?.reference as string) ?? ''}
            onChange={(e) => handleChnage('reference', e.target.value)}
          />
        )}
        {filters.showCode && (
          <Input
            type="text"
            Label="Code"
            value={(allFilters?.name as string) ?? ''}
            onChange={(e) => handleChnage('name', e.target.value)}
          />
        )}
        {filters.showBusinessType && (
          <Select
            label="Business Type"
            value={(allFilters?.type as string) ?? ''}
            onChange={(value) => handleChnage('businessType', value)}
            endPoint="v1/super-admin/businessTypes"
            labelKey="name"
            valueKey="id"
          />
        )}
        {filters.showIsUsed && (
          <Select
            label="Is Used?"
            value={(allFilters?.is_used as string) ?? ''}
            onChange={(value) => handleChnage('is_used', value)}
            options={[
              { label: 'All', value: '' },
              { label: 'Yes', value: '1' },
              { label: 'No', value: '0' },
            ]}
            required
          />
        )}
        {filters.showEndAT && (
          <Input
            type="date"
            Label="End at"
            value={(allFilters?.end_at as string) ?? ''}
            onChange={(e) => handleChnage('end_at', e.target.value)}
          />
        )}
      </div>
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
    </>
  );
};

export default TableFilters;
