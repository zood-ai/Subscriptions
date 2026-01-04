import Table from "./Table";
import Form from "./Form";
import PageHeader from "@/components/PageHeader";

export default function Businesses() {
  return (
    <>
      <PageHeader title="Codes" Form={<Form />} />
      <Table />
    </>
  );
}
