import CategoryData from "./CategoryData";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Category({ params }: Props) {
  const { id } = await params;

  return <CategoryData id={id} />;
}
