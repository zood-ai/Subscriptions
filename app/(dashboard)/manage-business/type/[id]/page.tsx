import TypeData from './components/TypeData';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Type({ params }: Props) {
  const { id } = await params;

  return <TypeData id={id} />;
}
