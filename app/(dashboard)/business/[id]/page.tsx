import { CustomTable } from '@/components/CustomTable';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { DetailCard } from './components/DetailCard';

interface BusinessPageProps {
  params: Promise<{ id: string }>;
}

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'reference', header: 'Reference' },
  { key: 'taxGroup', header: 'Tax Group' },
  { key: 'createdAt', header: 'Created at' },
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
  return (
    <div>
      <div className="py-[15px] px-[60px] bg-white">
        <Link
          href="/business"
          className="text-gray-500 flex items-center gap-1 text-xs"
        >
          <ChevronLeft size={15} />
          Back
        </Link>
        <h1 className="text-gray-500 text-[24px] font-normal">{id}</h1>
      </div>
      <div className="py-[40px] px-[60px]">
        <DetailCard items={items} />
        <CustomTable data={[]} title="Tags" columns={columns} />
        <CustomTable data={[]} title="Delivery Zones" columns={columns} />
        <CustomTable data={[]} title="Users" columns={columns} />
        <CustomTable data={[]} title="Sections" columns={columns} />
        <CustomTable data={[]} title="Assigned Device" columns={columns} />
        <CustomTable data={[]} title="Assigned Discounts" columns={columns} />
        <CustomTable
          data={[]}
          title="Assigned Timed Events"
          columns={columns}
        />
        <CustomTable data={[]} title="Assigned Promotions" columns={columns} />
      </div>
    </div>
  );
}
