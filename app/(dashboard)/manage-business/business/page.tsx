import Table from "./components/Table";
import TableHeader from "@/components/TableHeader";
import Query from "@/lib/Query";
import CreateForm from "./components/CreateForm";

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

export default async function Businesses() {
  const countries = await Query<CountriesResponce>({
    api: "v1/manage/countries",
  });
  const businessTypes = await Query<BusinessTypesResponce>({
    api: "v1/manage/business-types",
  });
  return (
    <>
      <TableHeader
        CreateForm={
          <CreateForm
            countries={countries.data?.data || []}
            businessTypes={businessTypes?.data?.data || []}
          />
        }
        title="Business"
        createBtnTitle="Add Business"
      />
      <Table />
    </>
  );
}
