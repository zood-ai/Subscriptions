import Table from "./Table";
import Form from "./Form";
import PageHeader from "@/components/PageHeader";

export default function ZatcaConnection() {
  return (
    <>
      <PageHeader title="Zatca Connection" Form={<Form />} />
      <Table />
    </>
  );
}
