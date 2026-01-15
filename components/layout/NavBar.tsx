"use client";
import { User, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import SideBar from "./SideBar";
import CustomPopUp from "../CustomPopUp";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
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
          <div className="flex justify-end w-full">
            <CustomPopUp
              btnTrigger={
                <button className="rounded-full p-2 hover:bg-muted cursor-pointer transition">
                  <User className="h-5 w-5 text-muted-foreground" />
                </button>
              }
            >
              <Button
                variant="danger"
                onClick={handleLogout}
                className="w-full cursor-pointer bg-white justify-start gap-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </CustomPopUp>
          </div>
        </div>
      </header>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <SideBar
        isMobileView
        isMobileMenuOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
