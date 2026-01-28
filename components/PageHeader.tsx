'use client';
import { ChevronLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import CustomModal from './layout/CustomModal';
import { Button } from './ui/button';
import ActionPopUp from './ActionPopUp';
import { Badge, BadgeProps } from './ui/badge';
import { cn } from '@/lib/utils';
import { isBlockedInputs } from '@/constants/global';
interface Props {
  title?: string;
  isEdit?: boolean;
  deleteEndPoint?: string;
  Form?: React.ReactNode;
  businessActiveForm?: React.ReactNode;
  blockEndPoint?: string;
  isBlocked?: boolean;
  backUrl?: string;
  className?: string;
  badges?: (BadgeProps & { visible: boolean })[];
}

const PageHeader: React.FC<Props> = ({
  title,
  isEdit = false,
  deleteEndPoint = '',
  Form,
  businessActiveForm,
  blockEndPoint,
  isBlocked = false,
  backUrl = '',
  className = '',
  badges = [],
}) => {
  return (
    <div
      className={cn(
        'flex flex-wrap justify-between items-center gap-4 py-3.75 mainPaddingX bg-white',
        className
      )}
    >
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
        <div className="flex gap-x-4 gap-y-2 flex-wrap items-center">
          <h1 className="text-gray-500 text-[24px] font-normal">{title}</h1>
          <div className="flex gap-2">
            {badges.map((el, idx) =>
              el.visible ? (
                <Badge
                  key={idx}
                  variant={el.variant}
                  label={el.label}
                  className="mt-1"
                />
              ) : null
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {/* in Edit Only */}
        {isEdit && (
          <>
            {blockEndPoint && (
              <CustomModal
                title={isBlocked ? 'Unblock' : 'Block'}
                btnTrigger={
                  <Button variant="secondary">
                    {isBlocked ? 'Unblock' : 'Block'}
                  </Button>
                }
              >
                <ActionPopUp
                  endPoint={blockEndPoint}
                  method="POST"
                  message={
                    isBlocked
                      ? 'Are you sure you want to Unblock this business?'
                      : ''
                  }
                  inputs={isBlockedInputs(isBlocked)}
                  btnTitle={isBlocked ? 'Unblock' : 'Block'}
                  backUrl={backUrl}
                />
              </CustomModal>
            )}
            {businessActiveForm && (
              <CustomModal
                title="Active"
                btnTrigger={<Button variant="secondary">Active</Button>}
              >
                {businessActiveForm}
              </CustomModal>
            )}
            {deleteEndPoint && (
              <CustomModal
                title="Delete"
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
            title={isEdit ? 'Update' : 'Create'}
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
