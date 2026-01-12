import Details from './Details';

interface Props {
  params: Promise<{ reference: string; id: string }>;
}

export default async function User({ params }: Props) {
  const { reference, id } = await params;

  return <Details reference={reference} id={id} />;
}
