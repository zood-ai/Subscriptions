'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import CreateModal from './layout/CreateModal';

interface TableHeaderProps {
  title: string;
  createBtnTitle?: string;
  onAction?: () => void;
  CreateForm?: React.ReactNode;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  title = '',
  createBtnTitle = `Create ${title}`,
  onAction,
  CreateForm,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="py-[15px] mainPaddingX bg-white flex justify-between">
      <h1 className="text-gray-500 text-[24px] font-normal">{title}</h1>
      <Button
        onClick={() => {
          onAction?.();
          handleOpen?.();
        }}
      >
        {createBtnTitle}
      </Button>
      {CreateForm && (
        <CreateModal
          isOpen={isModalOpen}
          onClose={handleClose}
          title="Add New Business"
          className="max-w-xl"
        >
          <div className="flex flex-col gap-4">{CreateForm}</div>
        </CreateModal>
      )}
    </div>
  );
};

export default TableHeader;
