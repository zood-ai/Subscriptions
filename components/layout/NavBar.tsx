"use client";

import { User, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import Sidebar from "./SideBar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <>
      <header className="fixed left-0 md:left-64 right-8 -top-2.5 z-30 flex h-16 items-center border-b border-border bg-background px-6">
        <div className="flex w-full items-center justify-between">
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="flex justify-end w-full">
            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-full p-2 hover:bg-muted cursor-pointer transition">
                  <User className="h-5 w-5 text-muted-foreground" />
                </button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-44 p-2 rounded-xl border bg-background shadow-md"
              >
                <Button
                  variant="danger"
                  onClick={handleLogout}
                  className="w-full cursor-pointer bg-white justify-start gap-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
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
