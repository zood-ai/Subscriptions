"use client";
import {
  CustomTable,
  type Column,
  type ActionOption,
} from "@/components/CustomTable";
import { useRouter } from "next/navigation";
import { Category } from "@/types/categories";
import Form from "./Form";
import PageHeader from "@/components/PageHeader";

const columns: Column<Category>[] = [
  {
    key: "name",
    header: "Name",
  },
  {
    key: "created_at",
    header: "Created At",
    type: "date",
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

export default function CategoriesPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader title="Categories" Form={<Form />} />
      <div className="py-10 mainPaddingX">
        <CustomTable
          endPoint="v1/super-admin/categories"
          columns={columns}
          filters={{
            showName: true,
          }}
          onClickRow={(row) => {
            router.push(`/manage-business/category/${row.id}`);
          }}
          actions={actions}
          statusFilterKey="status"
        />
      </div>
    </>
  );
}
