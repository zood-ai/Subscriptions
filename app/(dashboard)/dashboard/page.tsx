'use client';
import { useState, useMemo } from 'react';
import useCustomQuery from '@/lib/Query';
import {
  BusinessType,
  DashboardStats,
  DashboardFilters,
  ChartDataPoint,
} from '@/types/dashboard';
import { Filter, Shuffle } from 'lucide-react';
import PieChar from './components/PieChar';
import { Button } from '@/components/ui/button';
import AllStats from './components/Stats';
import BarChar from './components/BarChar';
import { CustomTable } from '@/components/CustomTable';
import { useRouter } from 'next/navigation';
import SingleSelect from '@/components/SingleSelect';
import { Input } from '@/components/ui/input';
import { statusOptions, topInvoicesColumns, topUserColumns } from './constants';

export default function Dashboard() {
  const [filters, setFilters] = useState<DashboardFilters>({
    status: 'all',
  });
  const router = useRouter();

  const { data: stats, isFetching: statsLoading } =
    useCustomQuery<DashboardStats>({
      api: 'v1/super-admin/dashboard',
      queryKey: ['dashboard-stats', filters],
      filters: filters as Record<string, string | number | boolean>,
    });

  const { data: businessTypes, isFetching: typesLoading } = useCustomQuery<
    BusinessType[]
  >({
    api: 'v1/super-admin/businessTypes/dashboard',
    queryKey: ['business-types-dashboard'],
  });

  const isLoading = statsLoading || typesLoading;

  const statsChartData: ChartDataPoint[] = useMemo(() => {
    if (!stats) return [];
    return [
      {
        name: 'Active',
        value: stats.active_businesses,
        color: '#7272f6',
      },
      {
        name: 'New',
        value: stats.new_businesses,
        color: '#10b981',
      },
      {
        name: 'Expiring',
        value: stats.expiring_soon,
        color: '#f59e0b',
      },
      {
        name: 'Expired',
        value: stats.expired_businesses,
        color: '#ef4444',
      },
    ];
  }, [stats]);

  const businessTypesChartData: ChartDataPoint[] = useMemo(() => {
    if (!businessTypes) return [];
    return businessTypes
      .slice(0, 10)
      .map((type) => ({
        name: type.name_localized || type.name,
        value: type.business_count,
      }))
      .sort((a, b) => b.value - a.value);
  }, [businessTypes]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">Filters:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SingleSelect
              name="status"
              placeholder="Select Code Duration Period"
              value={filters.status || 'all'}
              onChange={(value) =>
                setFilters({
                  ...filters,
                  status: value as DashboardFilters['status'],
                })
              }
              className="w-fit"
              parentClassName="w-fit"
              options={statusOptions}
              loading={false}
              required
              showSearch
            />
            <Input
              type="date"
              value={filters.start_date || ''}
              onChange={(e) =>
                setFilters({ ...filters, start_date: e.target.value })
              }
              className="mt-0"
              parentClassName="w-fit"
            />
            <Shuffle size={20} />
            <Input
              type="date"
              value={filters.end_date || ''}
              onChange={(e) =>
                setFilters({ ...filters, end_date: e.target.value })
              }
              className="mt-0"
              parentClassName="w-fit"
            />
          </div>

          <Button
            variant="secondary"
            onClick={() => setFilters({ status: 'all' })}
            className="ml-auto rounded-lg px-4 py-2 bg-white border"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Stats */}
      <AllStats isLoading={isLoading} data={stats} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">
            Business Status Overview
          </h2>
          <PieChar data={statsChartData} isLoading={isLoading} />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">
            Top Business Types
          </h2>
          <BarChar isLoading={isLoading} data={businessTypesChartData} />
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomTable
          title="Top Businesses by Users"
          titleClassName="text-xl font-semibold text-gray-900"
          forceLoading={isLoading}
          showFilters={false}
          data={stats?.top_by_users ?? []}
          columns={topUserColumns}
          onClickRow={(business) => {
            router.push(`/manage-business/business/${business.reference}`);
          }}
        />

        <CustomTable
          title="Top Businesses by Invoices"
          titleClassName="text-xl font-semibold text-gray-900"
          forceLoading={isLoading}
          showFilters={false}
          data={stats?.top_by_invoices ?? []}
          columns={topInvoicesColumns}
          onClickRow={(business) => {
            router.push(`/manage-business/business/${business.reference}`);
          }}
        />
      </div>
    </div>
  );
}
