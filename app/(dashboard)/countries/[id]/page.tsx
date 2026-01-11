interface CountryProps {
  params: Promise<{ id: string }>;
}

export default async function CountryPage({ params }: CountryProps) {
  const countryId = (await params).id;
  return <h1>Country Page With Id - {countryId}</h1>;
}
