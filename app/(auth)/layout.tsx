import Image from 'next/image';
import React from 'react';
import Logo from '@/assets/logo.png';

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main>
      <nav className="p-4">
        <Image src={Logo} alt="App Logo" width={50} height={62} />
      </nav>
      <section className="p-4 sm:p-[30px] mx-auto w-full sm:w-[550px] ">
        {children}
      </section>
    </main>
  );
};

export default layout;
