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
import { Loader2Icon, LogOut, SquareDashedKanban } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export async function Header() {
  return (
    <div className="border-b py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl">
          <SquareDashedKanban />
          <div className="hidden md:block">HR Job Board</div>
        </Link>

        <div className="flex items-center justify-between gap-5">
          <Suspense
            fallback={
              <div className="flex w-40 items-center justify-center">
                <Loader2Icon className="h-4 w-4 animate-spin" />
              </div>
            }
          >
            <HeaderActions />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function ProfileAvatar({ user }: { user: User }) {
  if (!user) return null;
  return (
    <Avatar>
      <AvatarImage src={"/next.svg"} />
      <AvatarFallback>
        {user.userName?.substring(0, 2).toUpperCase() ?? "AA"}
      </AvatarFallback>
    </Avatar>
  );
}

async function HeaderActions() {
  const user = await getCurrentUser();
  const isSignedIn = !!user;
  return (
    <>
      {isSignedIn ? (
        <>
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          <ProfileDropdown user={user} />
        </>
      ) : (
        <>
          <ModeToggle />

          <Button asChild variant="secondary">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </>
      )}
    </>
  );
}
async function ProfileDropdown({ user }: { user: User }) {
  if (!user) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Suspense
          fallback={
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-800">
              ..
            </div>
          }
        >
          <ProfileAvatar user={user} />
        </Suspense>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="space-y-2" align="start">
        <DropdownMenuLabel>{user.userName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link className="flex items-center" href={"/api/sign-out"}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
