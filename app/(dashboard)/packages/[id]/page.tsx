interface PackageParams {
  params: Promise<{ id: string }>
}


export default async function Package({ params }: PackageParams) {
  const { id } = await params;
  return (
    <>
      <h1>Package - {id}</h1>
    </>
  )
}