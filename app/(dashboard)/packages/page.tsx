import Table from './Table';
import Form from './Form';
import PageHeader from '@/components/PageHeader';

export default function Packages() {
  return (
    <>
      <PageHeader title="Packages" Form={<Form />} />
      <Table />
    </>
  );
}
