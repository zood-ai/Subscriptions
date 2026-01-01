'use client';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import CustomModal from './layout/CustomModal';
import { Button } from './ui/button';
import DeletePopUp from './DeletePopUp';
interface Props {
  title?: string;
  isEdit?: boolean;
  deleteEndPoint?: string;
  Form?: React.ReactNode;
  backUrl?: string;
}

const PageHeader: React.FC<Props> = ({
  title,
  isEdit = false,
  deleteEndPoint = '',
  Form,
  backUrl = '',
}) => {
  return (
    <div className="flex justify-between items-center py-[15px] mainPaddingX bg-white">
      <div>
        {backUrl && (
          <Link
            href={backUrl}
            className="text-gray-500 flex items-center gap-1 text-xs"
          >
            <ChevronLeft size={15} />
            Back
          </Link>
        )}
        <h1 className="text-gray-500 text-[24px] font-normal">{title}</h1>
      </div>
      <div className="flex gap-2">
        {/* in Edit Only */}
        {isEdit && deleteEndPoint && (
          <CustomModal
            title={`Delete ${title}`}
            btnTrigger={<Button variant="danger">Delete</Button>}
          >
            <DeletePopUp
              message="Are you sure you want to delete this?"
              endPoint={deleteEndPoint}
              backUrl={backUrl}
            />
          </CustomModal>
        )}
        {/* in Create only */}
        {!isEdit && null}
        {/* Both */}
        {Form && (
          <CustomModal
            title={`${isEdit ? 'Update' : 'Create'} ${title}`}
            btnTrigger={<Button>{isEdit ? 'Update' : 'Create'}</Button>}
          >
            {Form}
          </CustomModal>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
