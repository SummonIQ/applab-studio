'use client';

import {
  BarChart3,
  BookOpen,
  Bot,
  Box,
  Brush,
  ChevronDown,
  Clock,
  Database,
  FileCode,
  FolderOpen,
  Grid3x3,
  Hammer,
  Home,
  Layers,
  Library,
  Lightbulb,
  Package,
  Palette,
  Settings,
  Settings2,
  Sparkles,
  Star,
  Tag,
  Users,
  Wand2,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  BarChart3,
  BookOpen,
  Bot,
  Box,
  Brush,
  Clock,
  Database,
  FileCode,
  FolderOpen,
  Grid3x3,
  Hammer,
  Home,
  Layers,
  Library,
  Lightbulb,
  Palette,
  Package,
  Settings,
  Settings2,
  Sparkles,
  Star,
  Tag,
  Users,
  Wand2,
  Workflow,
};

export interface NavigationItem {
  href: string;
  icon: string;
  name: string;
  children?: NavigationItem[];
}

interface NavigationMenuProps {
  items: NavigationItem[];
  collapsed?: boolean;
}

function NavItem({
  item,
  collapsed,
  pathname,
  level = 0,
}: {
  item: NavigationItem;
  collapsed: boolean;
  pathname: string;
  level?: number;
}) {
  const Icon = iconMap[item.icon];
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.href;
  const isChildActive =
    hasChildren &&
    item.children?.some(
      child => pathname === child.href || pathname.startsWith(child.href + '/'),
    );
  const [isOpen, setIsOpen] = useState(isActive || isChildActive);

  if (!Icon) return null;

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center w-full rounded-md text-[13px] font-medium transition-all duration-150',
            'border border-transparent',
            collapsed ? 'justify-center px-2 py-2' : 'gap-2.5 px-3 py-2',
            isActive || isChildActive
              ? 'text-primary'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
          )}
          title={collapsed ? item.name : undefined}
        >
          <Icon
            className={cn(
              'shrink-0',
              collapsed ? 'h-5 w-5' : 'h-[15px] w-[15px]',
            )}
          />
          {!collapsed && (
            <>
              <span className="truncate flex-1 text-left">{item.name}</span>
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 transition-transform duration-200',
                  isOpen && 'rotate-180',
                )}
              />
            </>
          )}
        </button>
        {!collapsed && isOpen && (
          <div className="ml-3 mt-0.5 border-l border-border/50 pl-2 flex flex-col gap-0.5">
            {item.children?.map(child => (
              <NavItem
                key={child.href}
                item={child}
                collapsed={collapsed}
                pathname={pathname}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center rounded-md text-[13px] font-medium transition-all duration-150',
        'border border-transparent',
        collapsed ? 'justify-center px-2 py-2' : 'gap-2.5 px-3 py-2',
        level > 0 && !collapsed && 'text-[12px] py-1.5',
        isActive
          ? 'bg-primary/15 text-primary shadow-sm'
          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
      )}
      title={collapsed ? item.name : undefined}
    >
      <Icon
        className={cn(
          'shrink-0',
          collapsed ? 'h-5 w-5' : 'h-[15px] w-[15px]',
          level > 0 && !collapsed && 'h-[13px] w-[13px]',
        )}
      />
      {!collapsed && <span className="truncate">{item.name}</span>}
    </Link>
  );
}

export function NavigationMenu({
  items,
  collapsed = false,
}: NavigationMenuProps) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 flex flex-col p-2">
      <div className="flex flex-col gap-1">
        {items
          .filter(item => {
            if (!iconMap[item.icon]) {
              console.warn(`Icon "${item.icon}" not found in iconMap`);
              return false;
            }
            return true;
          })
          .map(item => (
            <NavItem
              key={item.href}
              item={item}
              collapsed={collapsed}
              pathname={pathname}
            />
          ))}
      </div>
    </nav>
  );
}
