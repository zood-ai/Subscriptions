"use client";
import {
  CustomTable,
  type Column,
  type ActionOption,
  type StatusFiltersTab,
} from "@/components/CustomTable";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { BusinessData } from "@/types/business";
import { useRouter } from "next/navigation";
import Form from "./Form";

const columns: Column<BusinessData>[] = [{ key: "name", header: "Name" }];

const actions: ActionOption[] = [
  {
    label: "Delete",
    onClick: (selectedIds) => {
      console.log("Deleting items:", selectedIds);
      alert(`Deleting ${selectedIds.length} items`);
    },
  },
];

export default function Businesses() {
  const router = useRouter();
  return (
    <>
      <PageHeader title="Zatca" Form={<Form />} />
      <div className="py-10 mainPaddingX">
        <CustomTable
          endPoint="v1/super-admin/business"
          columns={columns}
          filters={{
            showName: true,
            showReference: true,
          }}
          actions={actions}
          onClickRow={(data) => {}}
          statusFilterKey="status"
        />
      </div>
    </>
  );
}
