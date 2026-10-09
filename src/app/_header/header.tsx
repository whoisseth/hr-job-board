import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser, User } from "@/lib/session";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2Icon,
  LogOut,
  SquareDashedKanban,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export async function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <SquareDashedKanban className="h-6 w-6 text-primary" />
            <span>HR Job Board</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/#featured-jobs"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Browse Jobs
            </Link>
            <Link
              href="/resume-parser"
              className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI Parser
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Suspense
            fallback={
              <div className="flex w-32 items-center justify-center">
                <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            }
          >
            <HeaderActions />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

function ProfileAvatar({ user }: { user: User }) {
  if (!user) return null;
  const initials =
    user.userName?.substring(0, 2).toUpperCase() ||
    user.email?.substring(0, 2).toUpperCase() ||
    "US";

  return (
    <Avatar className="h-9 w-9 border border-border shadow-sm">
      <AvatarFallback className="text-xs font-semibold bg-muted text-foreground">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

async function HeaderActions() {
  const user = await getCurrentUser();
  const isSignedIn = !!user;
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <ModeToggle />
      {isSignedIn ? (
        <>
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link
              href={
                user.role === "recruiter"
                  ? "/recruiter/dashboard"
                  : user.role === "candidate"
                  ? "/candidate/dashboard"
                  : "/user-info"
              }
              className="flex items-center gap-1.5"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </Link>
          </Button>
          <ProfileDropdown user={user} />
        </>
      ) : (
        <>
          <Button asChild variant="ghost" size="sm">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </>
      )}
    </div>
  );
}

function ProfileDropdown({ user }: { user: User }) {
  if (!user) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full p-0 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shrink-0"
        >
          <ProfileAvatar user={user} />
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.userName || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
            {user.role && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary pt-1">
                {user.role}
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link
            href={
              user.role === "recruiter"
                ? "/recruiter/dashboard"
                : user.role === "candidate"
                ? "/candidate/dashboard"
                : "/user-info"
            }
            className="flex items-center"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer text-destructive focus:text-destructive">
          <a href="/api/sign-out" className="flex items-center w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
