import { ChartDataPoint } from '@/types/dashboard';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const BarChar = ({
  isLoading = false,
  data = [],
}: {
  isLoading: boolean;
  data?: ChartDataPoint[];
}) => {
  return isLoading ? (
    <div className="h-64 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7272f6]"></div>
    </div>
  ) : (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#7272f6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChar;
