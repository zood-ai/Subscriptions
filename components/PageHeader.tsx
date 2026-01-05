'use client';
import { ChevronLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import CustomModal from './layout/CustomModal';
import { Button } from './ui/button';
import ActionPopUp, { Input } from './ActionPopUp';
interface Props {
  title?: string;
  isEdit?: boolean;
  deleteEndPoint?: string;
  Form?: React.ReactNode;
  businessActiveForm?: React.ReactNode;
  businessBlockEndPoint?: string;
  isBlocked?: boolean;
  backUrl?: string;
}

const PageHeader: React.FC<Props> = ({
  title,
  isEdit = false,
  deleteEndPoint = '',
  Form,
  businessActiveForm,
  businessBlockEndPoint,
  isBlocked,
  backUrl = '',
}) => {
  const businessBlockInputs: Input[] = isBlocked
    ? [
        {
          key: 'reason',
          label: 'Reason',
          value: '',
          type: 'text',
          isHidden: true,
        },
        {
          key: 'active',
          label: 'Active',
          value: '1',
          type: 'text',
          isHidden: true,
        },
      ]
    : [
        {
          key: 'reason',
          label: 'Reason',
          value: '',
          isRequired: true,
          type: 'text',
        },
        {
          key: 'active',
          label: 'Active',
          value: '0',
          type: 'text',
          isHidden: true,
        },
      ];
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 py-3.75 mainPaddingX bg-white">
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
            {businessBlockEndPoint && (
              <CustomModal
                modalType="block"
                title={isBlocked ? 'Unblock' : 'Block'}
                btnTrigger={
                  <Button variant="secondary">
                    {isBlocked ? 'Unblock' : 'Block'}
                  </Button>
                }
              >
                <ActionPopUp
                  endPoint={businessBlockEndPoint}
                  method="POST"
                  message={
                    isBlocked
                      ? 'Are you sure you want to Unblock this business?'
                      : ''
                  }
                  inputs={businessBlockInputs}
                  btnTitle={isBlocked ? 'Unblock' : 'Block'}
                  backUrl={backUrl}
                />
              </CustomModal>
            )}
            {businessActiveForm && (
              <CustomModal
                modalType="active"
                btnTrigger={<Button variant="secondary">Active</Button>}
              >
                {businessActiveForm}
              </CustomModal>
            )}
            {deleteEndPoint && (
              <CustomModal
                modalType="delete"
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
            modalType="create"
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
