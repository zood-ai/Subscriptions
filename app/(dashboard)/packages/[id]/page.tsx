import PackageDetails from './PackageDetails';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Package({ params }: Props) {
  const { id } = await params;

  return <PackageDetails id={id} />;
}
