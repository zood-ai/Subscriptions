import { Suspense } from 'react';
import Table from './components/Table';
import TableHeader from '@/components/TableHeader';
import TableLoading from '@/components/TableLoading';

export default function Businesses() {
  return (
    <div>
      <TableHeader title="Business" />
      <Suspense fallback={<TableLoading title="" />}>
        <Table />
      </Suspense>
    </div>
  );
}
