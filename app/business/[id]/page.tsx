interface BusinessPageProps {
  params: Promise<{ id: string }>
}

export default async function Business({ params }: BusinessPageProps) {
  const { id } = await params;
  return (
    <div>
      <h1>Business  - {id}</h1>
    </div>
  )
} 
