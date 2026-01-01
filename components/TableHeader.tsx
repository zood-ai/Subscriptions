'use client';
import { Button } from './ui/button';
import CustomModal from './layout/CustomModal';

interface TableHeaderProps {
  title: string;
  createBtnTitle?: string;
  Form?: React.ReactNode;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  title = '',
  createBtnTitle = `Create ${title}`,
  Form,
}) => {
  return (
    <div className="py-[15px] mainPaddingX bg-white flex justify-between">
      <h1 className="text-gray-500 text-[24px] font-normal">{title}</h1>

      {Form && (
        <CustomModal
          title="Add New Business"
          btnTrigger={<Button>{createBtnTitle}</Button>}
        >
          <div className="flex flex-col gap-4">{Form}</div>
        </CustomModal>
      )}
    </div>
  );
};

export default TableHeader;
