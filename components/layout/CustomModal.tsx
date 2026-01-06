'use client';
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { ModalTypes } from '@/context/ModalContext';

interface CustomModalProps {
  btnTrigger: React.ReactElement;
  children: React.ReactNode;
  title?: string;
  modalType: ModalTypes;
  className?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  btnTrigger,
  children,
  title,
  className,
  modalType,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const mouseDownPositionRef = useRef<{ x: number; y: number } | null>(null);
  const { openedModal, close, open } = useModal();
  const isOpen = openedModal === modalType;

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
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
  }, [isOpen, close]);

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDownPositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (mouseDownPositionRef.current) {
      const deltaX = Math.abs(e.clientX - mouseDownPositionRef.current.x);
      const deltaY = Math.abs(e.clientY - mouseDownPositionRef.current.y);

      if (deltaX > 5 || deltaY > 5) {
        mouseDownPositionRef.current = null;
        return;
      }
    }

    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      close();
    }

    mouseDownPositionRef.current = null;
  };

  return (
    <div>
      <div role="button" onClick={() => open(modalType)}>
        {btnTrigger}
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity"
          onMouseDown={handleMouseDown}
          onClick={handleBackdropClick}
        >
          <div
            ref={modalRef}
            className={cn(
              'bg-white shadow-lg w-full mx-4 flex flex-col max-h-[90vh] max-w-xl',
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
              <button
                onClick={() => close()}
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
