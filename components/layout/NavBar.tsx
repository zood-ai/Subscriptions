'use client';
import { User, Menu } from 'lucide-react';
import { useState } from 'react';
import Sidebar from './Sidbar';

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="fixed left-0 md:left-64 right-0 top-0 z-30 flex h-16 items-center border-b border-border bg-background px-6 transition-all duration-300 ease-in-out">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={toggleMobileMenu} className="cursor-pointer">
              <Menu className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          <div className="w-full flex justify-end">
            <User className="text-muted-foreground bg-[#FAFAFA] cursor-pointer" />
          </div>
        </div>
      </header>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <Sidebar
        isMobileView
        isMobileMenuOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
