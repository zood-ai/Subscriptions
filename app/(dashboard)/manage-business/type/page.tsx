import CreateForm from './CreateForm';
import Table from './Table';
import TableHeader from '@/components/TableHeader';

export default function BusinessTypes() {
  return (
    <>
      <TableHeader
        Form={<CreateForm />}
        title="Business Types"
        createBtnTitle="Add Business Type"
      />
      <Table />
    </>
  );
}
