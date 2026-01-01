import Table from './Table';
import TableHeader from '@/components/TableHeader';
import CreateForm from './CreateForm';

export interface BusinessTypesResponce {
  status: boolean;
  code: number;
  message: string;
  data: BusinessType[];
}

export interface BusinessType {
  id: string;
  name: string;
}

export interface CountriesResponce {
  status: boolean;
  code: number;
  message: string;
  data: Country[];
}

export interface Country {
  id: string;
  name_en: string;
}

export default function Businesses() {
  return (
    <>
      <TableHeader
        CreateForm={<CreateForm />}
        title="Business"
        createBtnTitle="Add Business"
      />
      <Table />
    </>
  );
}
