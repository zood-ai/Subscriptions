import React from 'react';
import {
  TrendingUp,
  Building2,
  Users,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { DashboardStats } from '@/types/dashboard';

const AllStats = ({
  data,
  isLoading = false,
}: {
  data?: DashboardStats;
  isLoading: boolean;
}) => {
  return isLoading ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <StatCard
        title="Total Businesses"
        value={data?.total_businesses || 0}
        icon={<Building2 className="w-6 h-6" />}
        color="bg-blue-500"
      />
      <StatCard
        title="Active Businesses"
        value={data?.active_businesses || 0}
        icon={<TrendingUp className="w-6 h-6" />}
        color="bg-[#7272f6]"
      />
      <StatCard
        title="New Businesses"
        value={data?.new_businesses || 0}
        icon={<Users className="w-6 h-6" />}
        color="bg-green-500"
      />
      <StatCard
        title="Expiring Soon"
        value={data?.expiring_soon || 0}
        icon={<AlertCircle className="w-6 h-6" />}
        color="bg-amber-500"
      />
      <StatCard
        title="Expired"
        value={data?.expired_businesses || 0}
        icon={<XCircle className="w-6 h-6" />}
        color="bg-red-500"
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} p-3 rounded-lg text-white`}>{icon}</div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

export default AllStats;
