import type { ReactNode } from 'react';

export interface DetailItem {
  title: string;
  value: string | ReactNode;
  isHidden?: boolean;
}

interface DetailCardProps {
  items: DetailItem[];
}

export function DetailCard({ items }: DetailCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
        {items.map((item, idx) => (
          <DetailField
            key={idx}
            title={item.title}
            value={item.value}
            isHidden={item.isHidden}
          />
        ))}
      </div>
    </div>
  );
}

function DetailField({ title, value, isHidden = false }: DetailItem) {
  if (isHidden) {
    return null;
  }
  return (
    <div className="border-b-2 border-gray-200 pb-3">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}
