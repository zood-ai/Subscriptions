"use client";
import {
  CustomTable,
  type Column,
  type ActionOption,
} from "@/components/CustomTable";
import PageHeader from "@/components/PageHeader";
import { BusinessData } from "@/types/business";
import Form from "./Form";

const columns: Column<BusinessData>[] = [{ key: "name", header: "Name" }];

const actions: ActionOption[] = [
  {
    label: 'Delete',
    actionType: 'delete',
    method: 'DELETE',
    message: 'Are you sure you want to delete these?',
  },
];

export default function Businesses() {
  return (
    <>
      <PageHeader title="Zatca" Form={<Form />} />
      <div className="py-10 mainPaddingX">
        <CustomTable
          endPoint="v1/super-admin/business"
          columns={columns}
          filters={{
            showName: true,
          }}
          actions={actions}
          statusFilterKey="status"
        />
      </div>
    </>
  );
}
