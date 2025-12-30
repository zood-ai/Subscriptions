import CreateForm from './components/CreateForm';
import Table from './components/Table';
import TableHeader from '@/components/TableHeader';

export default function BusinessTypes() {
  return (
    <>
      <TableHeader
        CreateForm={<CreateForm />}
        title="Business Types"
        createBtnTitle="Add Business Type"
      />
      <Table />
    </>
  );
}
