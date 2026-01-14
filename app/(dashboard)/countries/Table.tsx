"use client";
import {
  CustomTable,
  type Column,
  type ActionOption,
} from "@/components/CustomTable";
import { useRouter } from "next/navigation";

interface CountryData {
  name_en: string;
  created_at: string;
  id: string;
}

const columns: Column<CountryData>[] = [
  { key: "name_en", header: "Name" },
  {
    key: "created_at",
    header: "Created At",
    // type: "date",
  },
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

export default function Table() {
  const router = useRouter();
  return (
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
  );
}
