'use client';
import { ChevronLeft, Trash, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import CustomModal from './layout/CustomModal';
import { Button } from './ui/button';
import ActionPopUp from './ActionPopUp';
interface Props {
  title?: string;
  isEdit?: boolean;
  deleteEndPoint?: string;
  Form?: React.ReactNode;
  businessActiveForm?: React.ReactNode;
  businessDeActiveEndPoint?: string;
  backUrl?: string;
}

const PageHeader: React.FC<Props> = ({
  title,
  isEdit = false,
  deleteEndPoint = '',
  Form,
  businessActiveForm,
  businessDeActiveEndPoint,
  backUrl = '',
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 py-[15px] mainPaddingX bg-white">
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
        {isEdit && (
          <>
            {businessDeActiveEndPoint && (
              <CustomModal
                btnTrigger={<Button variant="secondary">Deactive</Button>}
              >
                <ActionPopUp
                  endPoint={businessDeActiveEndPoint}
                  method="POST"
                  inputs={[
                    {
                      key: 'reason',
                      label: 'Reason',
                      value: 'done',
                      options: [
                        { label: 'Payment finished', value: 'done' },
                        { label: 'other', value: 'other' },
                      ],
                    },
                  ]}
                  btnTitle="Deactive"
                  backUrl={backUrl}
                />
              </CustomModal>
            )}
            {businessActiveForm && (
              <CustomModal
                btnTrigger={<Button variant="secondary">Active</Button>}
              >
                {businessActiveForm}
              </CustomModal>
            )}
            {deleteEndPoint && (
              <CustomModal
                btnTrigger={
                  <Button variant="danger">
                    <Trash2 />
                    Delete
                  </Button>
                }
              >
                <ActionPopUp
                  message="Are you sure you want to delete this?"
                  endPoint={deleteEndPoint}
                  btnTitle="Delete"
                  method="DELETE"
                  backUrl={backUrl}
                />
              </CustomModal>
            )}
          </>
        )}

        {/* in Create only */}
        {!isEdit && <></>}

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
