import BusinessDetails from './BusinessDetails';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Business({ params }: Props) {
  const { id } = await params;

  return <BusinessDetails id={id} />;
}
