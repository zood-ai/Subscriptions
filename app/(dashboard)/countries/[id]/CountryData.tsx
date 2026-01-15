"use client";
import { DetailCard } from "@/components/DetailCard";
import { useRouter } from "next/navigation";
import { BusinessType } from "@/types/business";

import useCustomQuery from "@/lib/Query";
import LoadingComponent from "@/components/layout/loading";
import PageHeader from "@/components/PageHeader";
import Form from "../Form";

const CountryData = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data, isFetching } = useCustomQuery<BusinessType>({
    api: `v1/super-admin/businessTypes/${id}`,
    queryKey: ["businessTypes", id],
    options: {
      onError: () => {
        router.push("/manage-business/type");
      },
    },
  });

  const items = [
    { title: "Name", value: data?.businessType?.name },
    { title: "Created at", value: data?.businessType?.created_at },
  ];

  if (isFetching) {
    return <LoadingComponent />;
  }

  const formData = {
    name: data?.businessType?.name || "",
  };
  return (
    <>
      <PageHeader
        isEdit
        deleteEndPoint={`v1/super-admin/businessTypes/${id}`}
        title={data?.businessType?.name}
        backUrl="/countries"
        Form={<Form id={id} isEdit data={formData} />}
      />
      <div className="py-10 mainPaddingX">
        <DetailCard items={items} />
      </div>
    </>
  );
};

export default CountryData;
