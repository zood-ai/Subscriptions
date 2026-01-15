import Image from 'next/image';
import React from 'react';
import Logo from '@/assets/logo.svg';
import { ModalProvider } from '@/context/ModalContext';

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <nav className="p-4">
        <Image src={Logo} alt="App Logo" width={50} height={62} />
      </nav>
      <main className="p-4 sm:p-[30px] mx-auto w-full sm:w-[550px] ">
        <ModalProvider>{children}</ModalProvider>
      </main>
    </>
  );
};

export default layout;
