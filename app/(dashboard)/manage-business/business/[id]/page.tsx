import { CustomTable, type Column } from '@/components/CustomTable';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { DetailCard } from '@/components/DetailCard';
import { Suspense } from 'react';
import TableSkeleton from '@/components/TableSkeleton';

interface BusinessPageProps {
  params: Promise<{ id: string }>;
}

interface BranchData {
  id: string;
  name: string;
  reference: string;
  owner_email: string;
  created_at: string;
  end_at: string;
}

interface TableFetchProps {
  title: string;
  endPoint: string;
  columns: Column<BranchData>[];
}

const columns: Column<BranchData>[] = [
  { key: 'name', header: 'Name' },
  { key: 'reference', header: 'Reference' },
  { key: 'owner_email', header: 'Owner email' },
  { key: 'created_at', header: 'Created at' },
  { key: 'end_at', header: 'End at' },
];

export default async function Business({ params }: BusinessPageProps) {
  const { id } = await params;
  const items = [
    { title: 'Name', value: 'Abdelrahman' },
    { title: 'Name Localized', value: 'Abdelrahman' },
    { title: 'Reference', value: '52251' },
    { title: 'Opening From', value: '03:00' },
    { title: 'Opening To', value: '03:00' },
    { title: 'Inventory End of Day', value: '03:00' },
    { title: 'Tax Group', value: 'VAT' },
  ];
  const tables = [
    { id: 1, title: 'Tags', endPoint: 'v1/asdasd', columns },
    { id: 2, title: 'Delivery Zones', endPoint: 'v1/asdasd', columns },
    { id: 3, title: 'Users', endPoint: 'v1/asdasd', columns },
    { id: 4, title: 'Sections', endPoint: 'v1/asdasd', columns },
    { id: 5, title: 'Assigned Device', endPoint: 'v1/asdasd', columns },
    { id: 6, title: 'Assigned Discounts', endPoint: 'v1/asdasd', columns },
    { id: 7, title: 'Assigned Timed Events', endPoint: 'v1/asdasd', columns },
    { id: 8, title: 'Assigned Promotions', endPoint: 'v1/asdasd', columns },
  ];

  return (
    <div>
      <div className="py-[15px] mainPaddingX bg-white">
        <Link
          href="/manage-business/business"
          className="text-gray-500 flex items-center gap-1 text-xs"
        >
          <ChevronLeft size={15} />
          Back
        </Link>
        <h1 className="text-gray-500 text-[24px] font-normal">{id}</h1>
      </div>
      <div className="py-[40px] mainPaddingX">
        <DetailCard items={items} />
        {tables.map((el) => (
          <Suspense key={el.id} fallback={<TableSkeleton title={el.title} />}>
            <TableFetch
              title={el.title}
              columns={el.columns}
              endPoint={el.endPoint}
            />
          </Suspense>
        ))}
      </div>
    </div>
  );
}

const TableFetch: React.FC<TableFetchProps> = async ({
  title,
  columns,
  endPoint,
}) => {
  return <CustomTable endPoint={endPoint} title={title} columns={columns} />;
};
