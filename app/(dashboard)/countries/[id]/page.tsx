import CountryData from "./CountryData";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Type({ params }: Props) {
  const { id } = await params;

  return <CountryData id={id} />;
}
