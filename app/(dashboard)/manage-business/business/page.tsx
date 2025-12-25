import { Suspense } from 'react';
import Table from './components/Table';
import TableHeader from '@/components/TableHeader';
import TableLoading from '@/components/TableLoading';

export default function Businesses() {
  return (
    <>
      <TableHeader title="Business" createBtnTitle="Add Customer" />
      <Suspense fallback={<TableLoading title="Business" />}>
        <Table />
      </Suspense>
    </>
  );
}
