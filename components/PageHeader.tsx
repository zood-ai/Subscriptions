'use client';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import CustomModal from './layout/CustomModal';
import { Button } from './ui/button';

interface Props {
  title?: string;
  deleteEndPoint?: string;
  Form?: React.ReactNode;
  backUrl: string;
}

const PageHeader: React.FC<Props> = ({
  title,
  deleteEndPoint,
  Form,
  backUrl,
}) => {
  return (
    <div className="flex justify-between items-center py-[15px] mainPaddingX bg-white">
      <div>
        <Link
          href={backUrl}
          className="text-gray-500 flex items-center gap-1 text-xs"
        >
          <ChevronLeft size={15} />
          Back
        </Link>
        <h1 className="text-gray-500 text-[24px] font-normal">{title}</h1>
      </div>
      <CustomModal
        title={`Update ${title}`}
        btnTrigger={<Button>Update</Button>}
      >
        {Form}
      </CustomModal>
    </div>
  );
};

export default PageHeader;
