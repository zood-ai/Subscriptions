interface BusinessPageProps {
  params: Promise<{ id: string }>
}

export default async function Business({ params }: BusinessPageProps) {
  const { id } = await params;
  return (
    <div className="py-[40px] px-[60px]">
      <h1>Business - {id}</h1>
    </div>
  );
} 
