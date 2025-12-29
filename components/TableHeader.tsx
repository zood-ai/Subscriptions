'use client';
import React, { useState } from 'react';
import { Button } from './ui/button';
import CreateModal from './CreateModal';

interface TableHeaderProps {
  title: string;
  createBtnTitle?: string;
  onAction?: () => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  title = '',
  createBtnTitle = `Create ${title}`,
  onAction,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const handleCreate = () => {
    console.log('Create Logic Here');
    handleClose();
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
      <CreateModal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={createBtnTitle}
        onConfirm={handleCreate}
        confirmText="Apply"
        cancelText="Close"
      >
        <div className="flex flex-col gap-6">form here</div>
      </CreateModal>
    </div>
  );
};

export default TableHeader;
