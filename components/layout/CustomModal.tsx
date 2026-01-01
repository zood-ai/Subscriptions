'use client';
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface CustomModalProps {
  btnTrigger: React.ReactElement;
  children: React.ReactNode;
  title?: string;
  className?: string;
  open?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  btnTrigger,
  children,
  title,
  className,
  open = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(open);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <div>
      <div role="button" onClick={() => setIsOpen(true)}>
        {btnTrigger}
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity"
          onClick={handleBackdropClick}
        >
          <div
            ref={modalRef}
            className={cn(
              'bg-white rounded-lg shadow-lg w-full mx-4 flex flex-col max-h-[90vh] max-w-xl',
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              >
                <X size={24} className="cursor-pointer" />
              </button>
            </div>
            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#FAFAFA]">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomModal;
