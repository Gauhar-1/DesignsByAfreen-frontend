
'use client';

import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import { Package, ShoppingCart, Users, LayoutDashboard, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: ReactNode;
}

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-muted/30">
        <Sidebar collapsible="icon" className="border-r bg-sidebar text-sidebar-foreground">
          <SidebarHeader className="p-4">
            <div className="flex items-center justify-between">
              <Logo className="text-lg group-data-[collapsible=icon]:hidden" />
              <div className="group-data-[collapsible=icon]:mx-auto">
                <SidebarTrigger className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent" />
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      tooltip={item.label}
                      isActive={pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))}
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-2 mt-auto border-t border-sidebar-border">
            <SidebarMenu>
               <SidebarMenuItem>
                <Link href="/" legacyBehavior passHref>
                    <SidebarMenuButton 
                      tooltip="Back to Site"
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                        <LogOut className="h-5 w-5 rotate-180" />
                        <span>Back to Site</span>
                    </SidebarMenuButton>
                </Link>
               </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col overflow-y-auto bg-background">
          <header className="sticky top-0 z-[1000] flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 shadow-sm">
            <div className="md:hidden">
              <SidebarTrigger variant="ghost" size="icon" className="text-foreground" />
            </div>
             <h1 className="text-xl sm:text-2xl font-semibold font-headline text-primary">Admin Panel</h1>
          </header>
          <main className="flex-1 p-4 sm:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
