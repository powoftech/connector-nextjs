"use client";

import NavigationItem from "@/app/(platform)/_components/navigation-item";
import { Icon } from "@/app/_images/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IoBriefcase,
  IoBriefcaseOutline,
  IoChatbubbleEllipses,
  IoChatbubbleEllipsesOutline,
  IoCog,
  IoContrast,
  IoHome,
  IoHomeOutline,
  IoMoon,
  IoNotifications,
  IoNotificationsOutline,
  IoPeople,
  IoPeopleOutline,
  IoSearch,
  IoSearchOutline,
  IoSunny,
} from "react-icons/io5";
import {
  LuHistory,
  LuLogOut,
  LuPencil,
  LuSettings,
  LuUser,
} from "react-icons/lu";

const navigationItems = [
  {
    href: "/feed",
    icon: { filled: <IoHome />, outline: <IoHomeOutline /> },
  },
  {
    href: "/mynetwork",
    icon: { filled: <IoPeople />, outline: <IoPeopleOutline /> },
  },
  {
    href: "/jobs",
    icon: { filled: <IoBriefcase />, outline: <IoBriefcaseOutline /> },
  },
  {
    href: "/messaging",
    icon: {
      filled: <IoChatbubbleEllipses />,
      outline: <IoChatbubbleEllipsesOutline />,
    },
  },
  {
    href: "/notifications",
    icon: { filled: <IoNotifications />, outline: <IoNotificationsOutline /> },
  },
];

export default function PlatformHeader({ className }: { className?: string }) {
  const session = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [open, setOpen] = useState(false); // Command Dialog State

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Open Command Dialog using Ctrl + / or Cmd + / on Mac
      if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <header
        className={cn("flex h-16 w-full flex-row items-center", className)}
      >
        <div className="mx-auto flex w-full max-w-[100vw] flex-row items-center justify-between gap-2 px-6">
          <div className="flex w-[360px] min-w-fit flex-row items-center justify-between gap-2">
            <Link
              href="/"
              className="flex flex-shrink-0 items-center justify-between"
            >
              <span className="sr-only hidden">Connector</span>
              <Image
                src={Icon.default}
                alt="Connector Icon"
                className="h-9 w-auto dark:invert"
                priority
              />
            </Link>
            <Button
              variant="outline"
              className="w-full rounded-full"
              onClick={() => setOpen(true)}
            >
              <IoSearch />
              <span className="mr-auto">Search</span>
              <div className="hidden flex-row gap-1 sm:flex">
                <kbd className="pointer-events-none flex select-none items-center rounded border px-1.5 font-mono">
                  Ctrl
                </kbd>
                <kbd className="pointer-events-none flex select-none items-center rounded border px-1.5 font-mono">
                  /
                </kbd>
              </div>
            </Button>
          </div>

          <div className="hidden h-[var(--header-height)] flex-row flex-nowrap items-center justify-between gap-2 overflow-hidden sm:flex">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.href}
                href={item.href}
                currentPath={pathname}
                icon={item.icon}
              />
            ))}
          </div>

          {session.status === "loading" ? (
            <Skeleton className="h-10 w-[360px] min-w-fit rounded-full" />
          ) : (
            <div className="flex min-w-fit flex-row items-center justify-end gap-2 sm:w-[360px]">
              {session.data?.user.profile.role === Role.RECRUITER && (
                <>
                  <Button
                    asChild
                    size="default"
                    variant="secondary"
                    className="group hidden w-10 rounded-full p-0 transition-all duration-300 ease-in-out hover:w-fit hover:px-4 hover:py-2 sm:flex"
                  >
                    <Link href="/job-posting">
                      <LuPencil />
                      <span className="hidden transition-all duration-1000 ease-in-out group-hover:inline">
                        Post a job
                      </span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="icon"
                    variant="secondary"
                    className="rounded-full sm:hidden"
                  >
                    <Link href="/job-posting">
                      <LuPencil />
                    </Link>
                  </Button>
                </>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer select-none border">
                    <AvatarImage
                      src={
                        session.data?.user?.image
                          ? session.data?.user?.image
                          : "https://github.com/powoftech.png"
                      }
                    />
                    <AvatarFallback>
                      {session.data?.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="-mr-10 mt-[60px]"
                  side="left"
                  sideOffset={0}
                >
                  <DropdownMenuLabel>
                    {session.data?.user?.name}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link href={"/"}></Link>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() =>
                        router.push(`/in/${session.data?.user?.id}`)
                      }
                    >
                      <LuUser />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => router.push(`/history`)}
                      disabled
                    >
                      <LuHistory />
                      <span>History</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => router.push(`/settings`)}
                      disabled
                    >
                      <LuSettings />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <IoContrast />
                      <span>Display</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          className={`cursor-pointer ${theme === "system" && "font-bold"}`}
                          onClick={() => setTheme("system")}
                        >
                          <IoCog />
                          <span>Automatic</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={`cursor-pointer ${theme === "light" && "font-bold"}`}
                          onClick={() => setTheme("light")}
                        >
                          <IoSunny />
                          <span>Light</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={`cursor-pointer ${theme === "dark" && "font-bold"}`}
                          onClick={() => setTheme("dark")}
                        >
                          <IoMoon />
                          <span>Dark</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => signOut({ redirectTo: "/" })}
                  >
                    <LuLogOut />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </header>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="w-[calc(100%-48px)] sm:w-full"
      >
        <CommandInput placeholder="Search" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <IoSearchOutline />
              <span>interview tips</span>
            </CommandItem>
            <CommandItem>
              <IoSearchOutline />
              <span>latest in ai</span>
            </CommandItem>
            <CommandItem>
              <IoSearchOutline />
              <span>balancing work and life balance</span>
            </CommandItem>
            <CommandItem>
              <IoSearchOutline />
              <span>remote work</span>
            </CommandItem>
            <CommandItem>
              <IoSearchOutline />
              <span>when&apos;s the best time to switch jobs</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          {/* <CommandGroup heading="History">
          </CommandGroup> */}
        </CommandList>
      </CommandDialog>
    </>
  );
}
