import Table from "./Table";
import Form from "./Form";
import PageHeader from "@/components/PageHeader";

const CountriesPage = () => {
  return (
    <>
      <PageHeader title="Country" Form={<Form />} />
      <Table />
    </>
  );
};
export default CountriesPage;
