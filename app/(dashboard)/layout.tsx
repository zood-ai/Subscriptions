import SideBar from '@/components/layout/SideBar';
import NavBar from '@/components/layout/NavBar';
import { ModalProvider } from '@/context/ModalContext';
import { NavigationProvider, NavigationProgress } from 'next-progressbar-link';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NavigationProvider>
      <NavigationProgress color="#7272F6" />
      <SideBar />
      <NavBar />
      <main className="pt-16 md:ml-64 transition-all duration-300 ease-in-out">
        <div className="bg-[#FAFAFA] min-h-[calc(100vh-64px)]">
          <ModalProvider>{children}</ModalProvider>
        </div>
      </main>
    </NavigationProvider>
  );
}
