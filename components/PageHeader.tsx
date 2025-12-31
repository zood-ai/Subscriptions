'use client';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import CreateModal from './layout/CreateModal';

interface Props {
  title?: string;
  deleteEndPoint?: string;
  updateEndPoint?: string;
  Form?: React.ReactNode;
  backUrl: string;
}

const PageHeader: React.FC<Props> = ({
  title,
  deleteEndPoint,
  updateEndPoint,
  Form,
  backUrl,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => {
    setIsModalOpen(false);
  };
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
      {/* {Form && (
        <CreateModal
          isOpen={isModalOpen}
          onClose={handleClose}
          title="Edit"
          className="max-w-xl"
        >
          <div className="flex flex-col gap-4">{Form}</div>
        </CreateModal>
      )} */}
      {Form}
    </div>
  );
};

export default PageHeader;
