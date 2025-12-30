import { Suspense } from 'react';
import Table from './components/Table';
import TableHeader from '@/components/TableHeader';
import TableLoading from '@/components/TableLoading';
import Query from '@/lib/Query';
import CreateForm from './components/CreateForm';


export default async function Businesses() {
  const countries = await Query({ api: 'v1/manage/countries' });
  const businessTypes = await Query({ api: 'v1/manage/business-types' })
  return (
    <>
      <TableHeader CreateForm={<CreateForm countries={countries} businessTypes={businessTypes} />} title="Business" createBtnTitle="Add Business" />
      <Suspense fallback={<TableLoading title="Business" />}>
        <Table />
      </Suspense>
    </>
  );
}
