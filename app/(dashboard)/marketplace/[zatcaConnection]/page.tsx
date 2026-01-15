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

const columns: Column<BusinessData>[] = [
  { key: "name", header: "Name" },
  {
    key: "end_at",
    header: "is Active?",
    render: (_, item) => (
      <div className="text-nowrap">
        {new Date() < new Date(item.end_at) ? (
          <Badge variant="success" label="Active" />
        ) : (
          <Badge variant="danger" label="Expired" />
        )}
      </div>
    ),
  },
  {
    key: "active",
    header: "is Blocked?",
    render: (value) => (
      <div className="text-nowrap">
        {value === 0 ? (
          <Badge variant="danger" label="Blocked" />
        ) : (
          <Badge variant="success" label="No" />
        )}
      </div>
    ),
  },
  { key: "reference", header: "Reference" },
  { key: "owner_email", header: "Owner email" },
  { key: "created_at", header: "Created at", type: "date" },
  { key: "end_at", header: "End at", type: "date" },
];

const filters: StatusFiltersTab[] = [
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
          statusFilters={filters}
          filters={{
            showName: true,
            showReference: true,
          }}
          actions={actions}
          onClickRow={(data) => {
            router.push(`/manage-business/business/${data.reference}`);
          }}
          statusFilterKey="status"
        />
      </div>
    </>
  );
}
