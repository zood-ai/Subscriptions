"use client";
import {
  CustomTable,
  type Column,
  type FilterTab,
  type ActionOption,
} from "@/components/CustomTable";
import { ActivationCodeData } from "@/types/business";

const columns: Column<ActivationCodeData>[] = [
  { key: "code", header: "Code" },
  { key: "duration", header: "Duration" },
  { key: "created_at", header: "Created At" },
  { key: "is_used", header: "Is Used" },
];

const filters: FilterTab[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
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
        filterKey="status"
      />
    </div>
  );
}
