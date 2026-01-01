import Table from './Table';
import CreateForm from './CreateForm';
import PageHeader from '@/components/PageHeader';

export default function Businesses() {
  return (
    <>
      <PageHeader deleteEndPoint="123" title="Business" Form={<CreateForm />} />
      <Table />
    </>
  );
}
