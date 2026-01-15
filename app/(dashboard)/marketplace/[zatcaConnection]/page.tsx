"use client";
import Form from "./Form";
import PageHeader from "@/components/PageHeader";
import { ActionOption, Column, CustomTable } from "@/components/CustomTable";
import { useRouter } from "next/navigation";
import { BusinessData } from "@/types/business";

export default function ZatcaConnection() {
  const router = useRouter();
  const columns: Column<BusinessData>[] = [
    { key: "name", header: "Name" },
    { key: "reference", header: "Reference" },
    { key: "owner_email", header: "Owner email" },
    { key: "created_at", header: "Created at" },
    { key: "end_at", header: "End at" },
  ];
  const actions: ActionOption[] = [
    {
      label: "Delete",
      onClick: (selectedIds) => {
        console.log("Deleting items:", selectedIds);
        alert(`Deleting ${selectedIds.length} items`);
      },
    },
  ];
  return (
    <>
      <PageHeader title="Zatca Connection" Form={<Form />} />
      <div className="py-10 mainPaddingX">
        <CustomTable
          endPoint="v1/super-admin/countries"
          columns={columns}
          filters={[]}
          onClickRow={(row) => {
            router.push(`/countries/${row.id}`);
          }}
          actions={actions}
          filterKey="status"
        />
      </div>
    </>
  );
}
