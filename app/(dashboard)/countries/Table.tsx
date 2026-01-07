"use client";
import {
  CustomTable,
  type Column,
  type ActionOption,
} from "@/components/CustomTable";

interface CountryData {
  name: string;
  id: string;
}

const columns: Column<CountryData>[] = [{ key: "name", header: "Name" }];

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
  return (
    <div className="py-10 mainPaddingX">
      <CustomTable
        endPoint="v1/manage/countries"
        columns={columns}
        filters={[]}
        actions={actions}
        filterKey="status"
      />
    </div>
  );
}
