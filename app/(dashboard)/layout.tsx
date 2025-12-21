import Sidbar from '@/components/layout/Sidbar';
import NavBar from '@/components/layout/NavBar';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidbar />
      <NavBar />
      <main className='pt-16 md:ml-64 transition-all duration-300 ease-in-out'>
        <div className='p-6 bg-[#FAFAFA] min-h-[calc(100vh-64px)]'>
          {children}
        </div>
      </main>
    </>
  );
}
