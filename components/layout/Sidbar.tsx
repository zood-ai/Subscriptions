'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import Logo from "@/assets/Logo"
import { Monitor, Package, Briefcase, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import ButtonComponent from "../Button"

interface MenuItemProps {
  label: string
  path: string
  icon: React.ElementType
}

interface SidebarProps {
  isMobileView?: boolean
  isMobileMenuOpen?: boolean
  onClose?: () => void
}

const menuItems: MenuItemProps[] = [
  { label: "Dashboard", path: "/dashboard", icon: Monitor },
  { label: "Business", path: "/business", icon: Briefcase },
  { label: "Packages", path: "/packages", icon: Package },
]

export default function Sidebar({
  isMobileView = false,
  isMobileMenuOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40 w-64 bg-white border-r
        ${isMobileView
          ? `inset-y-0 z-50 shadow-lg transition-transform duration-300 md:hidden
             ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`
          : "hidden md:block h-screen"}
      `}
    >
      <div className={`flex items-center px-6 ${isMobileView ? "h-16 justify-between border-b" : "h-20 justify-center my-4"}`}>
        {
          isMobileView ? (
            <Link href="/" className="w-9 flex items-center justify-center">
              <Logo />
            </Link>
          ) : <Link href="/"> <Logo /> </Link>
        }
        {isMobileView && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <main className="flex flex-col justify-between overflow-y-auto h-[calc(100vh-10rem)]">
        <nav
          aria-label={isMobileView ? "Mobile Sidebar Navigation" : "Dashboard Sidebar Navigation"}
          className={`space-y-1 pr-2 ${isMobileView ? "py-4" : ""}`}
        >
          <ul className={isMobileView ? "space-y-4" : "space-y-2"}>
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path

              return (
                <li key={item.label}>
                  <Link
                    href={item.path}
                    onClick={isMobileView ? onClose : undefined}
                    className={`
                    flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors
                    rounded-tr-lg rounded-br-lg
                    ${isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100"}
                  `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="bottom-16 mx-auto flex justify-center">
          <ButtonComponent onClick={() => { }}>
            Log out
          </ButtonComponent>
        </div>
      </main>
    </aside>
  )
}
