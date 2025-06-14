
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
  SidebarTrigger, // This is the trigger for desktop icon mode & mobile sheet
  SidebarInset,
  useSidebar, // Import useSidebar hook
} from '@/components/ui/sidebar';
import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import { Package, ShoppingCart, Users, LayoutDashboard, LogOut, PanelLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SheetTitle } from '@/components/ui/sheet'; // Import SheetTitle

interface AdminLayoutProps {
  children: ReactNode;
}

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
];

// Helper component to conditionally render the title
const AdminSidebarTitleContent = () => {
  const { isMobile } = useSidebar();
  const logoComponent = <Logo className="text-lg group-data-[collapsible=icon]:hidden" />;

  if (isMobile) {
    // When mobile, the SidebarHeader contents are rendered inside a Sheet, so SheetTitle is appropriate
    return <SheetTitle>{logoComponent}</SheetTitle>;
  }
  // On desktop, SidebarHeader is not inside a Sheet, so render the logo directly
  return logoComponent;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-muted/30">
        <Sidebar collapsible="icon" className="border-r bg-sidebar text-sidebar-foreground">
          <SidebarHeader className="p-4">
            <div className="flex items-center justify-between">
              <AdminSidebarTitleContent />
              <div className="group-data-[collapsible=icon]:mx-auto">
                {/* This SidebarTrigger is for desktop icon mode (collapsing to icons) */}
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
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:hover:bg-sidebar-primary/90"
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
            {/* This SidebarTrigger is for opening the mobile sheet (off-canvas) */}
            <SidebarTrigger variant="ghost" size="icon" className="md:hidden text-foreground">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </SidebarTrigger>
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
