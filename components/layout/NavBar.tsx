'use client';
import { User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Sidebar from "./Sidbar";


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
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="cursor-pointer">
              <Menu className="h-6 w-6 text-muted-foreground" />
            </Button>
          </div>

          <div className="w-full flex justify-end">
            <Button variant="ghost" className="cursor-pointer">
              <User className="text-muted-foreground" />
            </Button>
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
  )
}