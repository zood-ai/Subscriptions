import Table from "./Table";
import Form from "./Form";
import PageHeader from "@/components/PageHeader";

export default function ActivationCodes() { 
  return (
    <>
      <PageHeader title="Code" Form={<Form />} />
      <Table />
    </>
  );
}
