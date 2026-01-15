"use client";
import { DetailCard } from "@/components/DetailCard";
import { useRouter } from "next/navigation";
import { Responce } from "@/types/countries";
import useCustomQuery from "@/lib/Query";
import LoadingComponent from "@/components/layout/loading";
import PageHeader from "@/components/PageHeader";
import Form from "../Form";

const CountryData = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data, isFetching } = useCustomQuery<Responce>({
    api: `v1/super-admin/countries/${id}`,
    queryKey: ["countries", id],
    options: {
      onError: () => {
        router.push("/countries");
      },
    },
  });

  const items = [
    { title: "Name", value: data?.data?.name },
    { title: "Created at", value: data?.data?.created_at },
  ];

  if (isFetching) {
    return <LoadingComponent />;
  }

  const formData = {
    name: data?.data?.name || "",
  };
  return (
    <>
      <PageHeader
        isEdit
        deleteEndPoint={`v1/super-admin/countries/${id}`}
        title={data?.data?.name}
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
