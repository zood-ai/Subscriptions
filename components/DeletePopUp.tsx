"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity">
      <div
        // ref={modalRef}
        className={cn(
          "bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 flex flex-col max-h-[90vh]",
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
        {/* content */}
        <div className="space-y-4 p-6">
          <h2 className="">{title}</h2>
          <p className=" text-gray-600">{message}</p>
          {error && <p className="text-red-500">{error}</p>}
        </div>
        {/* Action buttons */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200">
          <Button
            onClick={async () => {
              try {
                setLoading(true);
                const res = await axios.delete(
                  `${process.env.NEXT_PUBLIC_BE_BASE_URL}/${endPoint}`
                );
                if (res.status !== 200) {
                  setError("Failed to delete the item.");
                  setLoading(false);
                  return;
                }
                setLoading(false);
                onDelete();
              } catch (err) {
                setError("An error occurred while deleting the item.");
                setLoading(false);
              }
            }}
            title="Close"
            variant="danger"
            disabled={loading}
            className={`${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
export default DeletePopUp;
