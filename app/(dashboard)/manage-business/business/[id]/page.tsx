import BusinessFetch from './BusinessFetch';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Business({ params }: Props) {
  const { id } = await params;

  return <BusinessFetch id={id} />;
}
