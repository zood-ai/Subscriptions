'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/assets/logo.svg';
import { Monitor, Package, Briefcase, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState } from 'react';

interface MenuItemProps {
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
  children?: {
    id: string;
    label: string;
    path: string;
  }[];
}

interface SidebarProps {
  isMobileView?: boolean;
  isMobileMenuOpen?: boolean;
  onClose?: () => void;
}

const menuItems: MenuItemProps[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: Monitor },
  {
    id: 'manage-business',
    label: 'Manage Business',
    path: '/manage-business',
    icon: Briefcase,
    children: [
      {
        id: 'businesses',
        label: 'Businesses',
        path: '/manage-business/business',
      },
      {
        id: 'type',
        label: 'Business Types',
        path: '/manage-business/type',
      },
    ],
  },
  { id: 'packages', label: 'Packages', path: '/packages', icon: Package },
];

export default function Sidebar({
  isMobileView = false,
  isMobileMenuOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isItemExpanded = (id: string) => expandedItems.includes(id);

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40 w-64 bg-white border-r
        ${
          isMobileView
            ? `inset-y-0 z-50 shadow-lg transition-transform duration-300 md:hidden
             ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
            : 'hidden md:block h-screen'
        }
      `}
    >
      <div
        className={`flex items-center px-6 ${
          isMobileView
            ? 'h-16 justify-between border-b'
            : 'h-20 justify-center my-4'
        }`}
      >
        {isMobileView ? (
          <Link href="/" className="w-9 flex items-center justify-center">
            <Image src={Logo} alt="Logo" />
          </Link>
        ) : (
          <Link href="/">
            {' '}
            <Image src={Logo} alt="Logo" />{' '}
          </Link>
        )}
        {isMobileView && (
          <button className="cursor-pointer" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav
        aria-label={
          isMobileView
            ? 'Mobile Sidebar Navigation'
            : 'Dashboard Sidebar Navigation'
        }
        className={`space-y-1 pr-2 ${isMobileView ? 'py-4' : ''}`}
      >
        <ul className={isMobileView ? 'space-y-4' : 'space-y-2'}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.includes(item.path);
            const isExpanded = isItemExpanded(item.id);
            const hasChildren = item.children && item.children.length > 0;

            return (
              <li key={item.id}>
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.path}
                    onClick={isMobileView ? onClose : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors rounded-lg ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )}

                {hasChildren && isExpanded && (
                  <ul className="mt-1 ml-6 space-y-1 border-l border-gray-200 pl-3">
                    {item?.children?.map((child) => {
                      const isChildActive = pathname.includes(child.path);
                      return (
                        <li key={child.id}>
                          <Link
                            href={child.path}
                            onClick={isMobileView ? onClose : undefined}
                            className={`
                              flex items-center gap-3 px-3 py-2 text-sm transition-colors
                              rounded
                              ${
                                isChildActive
                                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                              }
                            `}
                          >
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
