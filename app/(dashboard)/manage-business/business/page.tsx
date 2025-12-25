import { Suspense } from 'react';
import Table from './components/Table';
import TableHeader from '@/components/TableHeader';
import TableSkeleton from '@/components/TableSkeleton';

export default function Businesses() {
  return (
    <>
      <TableHeader title="Business" />
      <Suspense fallback={<TableSkeleton className="pt-[40px] mainPaddingX" />}>
        <Table />
      </Suspense>
    </>
  );
}
