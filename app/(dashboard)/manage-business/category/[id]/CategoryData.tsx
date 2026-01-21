"use client";
import { DetailCard, DetailItem } from "@/components/DetailCard";
import { useRouter } from "next/navigation";
import { CategoryResponseData } from "@/types/categories";
import useCustomQuery from "@/lib/Query";
import LoadingComponent from "@/components/layout/loading";
import PageHeader from "@/components/PageHeader";
import Form from "../Form";
import { formatDate } from "@/lib/utils";

const CategoryData = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data, isFetching } = useCustomQuery<CategoryResponseData>({
    api: `v1/manage/categories/${id}`,
    queryKey: ["category", id],
    options: {
      onError: () => {
        router.push("/manage-business/category");
      },
    },
  });

  const items: DetailItem[] = [
    { title: "Name", value: data?.data?.name },
    { title: "Name (EN)", value: data?.data?.name_en },
    {
      title: "Created at",
      value: formatDate(data?.data?.created_at ?? ""),
    },
  ];

  if (isFetching) {
    return <LoadingComponent />;
  }
  const formData = {
    name: data?.data?.name || "",
    name_en: data?.data?.name_en || "",
  };
  return (
    <>
      <PageHeader
        isEdit
        deleteEndPoint={`v1/manage/categories/${id}`}
        title={data?.data?.name}
        backUrl="/categories"
        Form={<Form id={id} isEdit data={formData} />}
      />
      <div className="py-10 mainPaddingX">
        <DetailCard items={items} />
      </div>
    </>
  );
};
export default CategoryData;
