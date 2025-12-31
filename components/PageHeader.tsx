import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface Props {
  title?: string;
  endPoint?: string;
  backUrl: string;
}

const PageHeader: React.FC<Props> = ({ title, endPoint, backUrl }) => {
  return (
    <div className="py-[15px] mainPaddingX bg-white">
      <Link
        href={backUrl}
        className="text-gray-500 flex items-center gap-1 text-xs"
      >
        <ChevronLeft size={15} />
        Back
      </Link>
      <h1 className="text-gray-500 text-[24px] font-normal">{title}</h1>
    </div>
  );
};

export default PageHeader;
