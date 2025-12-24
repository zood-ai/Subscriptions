import React from 'react';
import { Button } from './ui/button';

interface TableHeaderProps {
  title: string;
  createBtnTitle?: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  title = '',
  createBtnTitle = `Create ${title}`,
}) => {
  return (
    <div className="py-[15px] px-[60px] bg-white flex justify-between">
      <h1 className="text-gray-500 text-[24px] font-normal">{title}</h1>
      <Button>{createBtnTitle}</Button>
    </div>
  );
};

export default TableHeader;
