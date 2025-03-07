"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Home, FileText, User, LogOut, Menu, X } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarLayoutProps {
  children: React.ReactNode;
  userRole: "recruiter" | "candidate";
  userName: string;
}

export function SidebarLayout({
  children,
  userRole,
  userName,
}: SidebarLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const recruiterLinks = [
    { href: "/recruiter/dashboard", label: "Dashboard", icon: Home },
    { href: "/recruiter/jobs", label: "Manage Jobs", icon: Briefcase },
    { href: "/recruiter/applications", label: "Applications", icon: FileText },
  ];

  const candidateLinks = [
    { href: "/candidate/dashboard", label: "Dashboard", icon: Home },
    { href: "/candidate/jobs", label: "Browse Jobs", icon: Briefcase },
    {
      href: "/candidate/applications",
      label: "My Applications",
      icon: FileText,
    },
    { href: "/candidate/resume", label: "My Resume", icon: User },
  ];

  const links = userRole === "recruiter" ? recruiterLinks : candidateLinks;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex">
          <SidebarHeader className="flex items-center justify-between p-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-md bg-primary p-1 text-primary-foreground">
                <Briefcase className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">JobBoard</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton asChild isActive={pathname === link.href}>
                    <Link href={link.href}>
                      <link.icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt={userName}
                    />
                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{userName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${userRole}/applications`}>
                    {userRole === "candidate"
                      ? "My Applications"
                      : "View Applications"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/sign-out">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Mobile Header */}
        <div className="fixed top-0 z-50 flex w-full items-center justify-between border-b bg-background p-4 md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1 text-primary-foreground">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">JobBoard</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 mt-16 bg-background md:hidden">
            <nav className="flex flex-col p-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                    pathname === link.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
              <div className="mt-auto pt-4">
                <div className="flex items-center gap-2 rounded-md px-3 py-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt={userName}
                    />
                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{userName}</span>
                </div>
                <Link
                  href="/sign-out"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </Link>
              </div>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 pt-16 md:pt-0">
          <main className="container mx-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
