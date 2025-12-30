import Table from './components/Table';
import TableHeader from '@/components/TableHeader';
import Query from '@/lib/Query';
import CreateForm from './components/CreateForm';


export default async function Businesses() {
  const countries = await Query({ api: 'v1/manage/countries' });
  const businessTypes = await Query({ api: 'v1/manage/business-types' })
  return (
    <>
      <TableHeader CreateForm={<CreateForm countries={countries} businessTypes={businessTypes} />} title="Business" createBtnTitle="Add Business" />
      <Table />
    </>
  );
}
