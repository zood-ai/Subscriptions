import PageHeader from '@/components/PageHeader';
import CreateForm from './CreateForm';
import Table from './Table';

export default function BusinessTypes() {
  return (
    <>
      <PageHeader
        deleteEndPoint="123"
        title="Business Types"
        Form={<CreateForm />}
      />
      <Table />
    </>
  );
}
