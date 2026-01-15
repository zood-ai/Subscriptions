import BusinessDetails from './components/BusinessDetails';

interface Props {
  params: Promise<{ reference: string }>;
}

export default async function Business({ params }: Props) {
  const { reference } = await params;

  return <BusinessDetails reference={reference} />;
}
