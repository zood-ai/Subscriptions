"use client";
import {
  CustomTable,
  type Column,
  type FilterTab,
  type ActionOption,
} from "@/components/CustomTable";

interface ActivationCodeData {
  business_reference: string;
  code: string;
  created_at: string;
  duration: string;
  id: string;
  is_used: number;
  updated_at: string;
}

const columns: Column<ActivationCodeData>[] = [
  { key: "code", header: "Code" },
  { key: "duration", header: "Duration" },
  { key: "created_at", header: "Created At" },
  { key: "is_used", header: "Is Used" },
];

const filters: FilterTab[] = [
  { label: "All", value: "all" },
  { label: "Used", value: "1" },
  { label: "Not Used", value: "0" },
];

const actions: ActionOption[] = [
  {
    label: "Delete",
    onClick: (selectedIds) => {
      console.log("Deleting items:", selectedIds);
      alert(`Deleting ${selectedIds.length} items`);
    },
  },
  {
    label: "Active",
    onClick: (selectedIds) => {
      console.log("Activing items:", selectedIds);
      alert(`Activing ${selectedIds.length} items`);
    },
  },
  {
    label: "DeActive",
    onClick: (selectedIds) => {
      console.log("DeActiveing items:", selectedIds);
      alert(`DeActiveing ${selectedIds.length} items`);
    },
  },
];

export default function Table() {
  return (
    <div className="py-10 mainPaddingX">
      <CustomTable
        endPoint="v1/activationcode/list"
        columns={columns}
        filters={filters}
        actions={actions}
        filterKey="is_used"
      />
    </div>
  );
}
