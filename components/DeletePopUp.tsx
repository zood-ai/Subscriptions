'use client';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import useCustomMutation from '@/lib/Mutation';

interface DeletePopUpProps {
  isOpen: boolean;
  onDelete: () => void;
  onCancel?: () => void;
  title: string;
  message: string;
  endPoint: string;
  className?: string;
}

const DeletePopUp: React.FC<DeletePopUpProps> = ({
  title,
  onDelete,
  isOpen,
  className,
  endPoint,
  message,
  onCancel,
}) => {
  const { mutate, isPending, error } = useCustomMutation<void, void>({
    api: endPoint,
    method: 'DELETE',
    options: {
      onSuccess: () => {
        onDelete();
      },
    },
  });

  const handleDelete = () => {
    mutate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity">
      <div
        className={cn(
          'bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 flex flex-col max-h-[90vh]',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Delete</h2>
          <button
            onClick={onCancel}
            title="Close"
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          >
            <X size={24} className="cursor-pointer" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-6">
          <h2>{title}</h2>
          <p className="text-gray-600">{message}</p>
          {error && <p className="text-red-500">{error?.data.message}</p>}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <Button
            onClick={handleDelete}
            variant="danger"
            disabled={isPending}
            loading={isPending}
            className={`${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopUp;
