import PageHeader from '@/components/PageHeader';
import Form from './Form';
import Table from './Table';

export default function BusinessTypes() {
  return (
    <>
      <PageHeader title="Business Types" Form={<Form />} />
      <Table />
    </>
  );
}
