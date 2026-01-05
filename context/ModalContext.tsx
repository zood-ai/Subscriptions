'use client';

import React, { createContext, useContext, useState } from 'react';

export type ModalTypes = 'create' | 'filter' | 'delete' | 'block' | 'active';

interface ModalContextType {
  openedModal: ModalTypes | null;
  open: (modalType: ModalTypes) => void;
  close: () => void;
  toggle: (modalType: ModalTypes) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openedModal, setOpenedModal] = useState<ModalTypes | null>(null);
  const open = (modalType: ModalTypes) => setOpenedModal(modalType);
  const close = () => setOpenedModal(null);
  const toggle = (modalType: ModalTypes) =>
    setOpenedModal((prev) => (prev ? null : modalType));
  return (
    <ModalContext.Provider value={{ openedModal, open, close, toggle }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider Scope');
  }
  return context;
};
