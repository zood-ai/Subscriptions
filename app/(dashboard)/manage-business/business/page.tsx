import Table from './components/Table';
import TableHeader from '@/components/TableHeader';

export default function Businesses() {
  return (
    <>
      <TableHeader title="Business" createBtnTitle="Add Business" />
      <Table />
    </>
  );
}
