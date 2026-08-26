"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ChevronDown } from "lucide-react";
import { Brand } from "@/components/site/brand";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/auth";

const courseLinks = [
  { href: "/courses?exam=JEE Main", label: "JEE Main" },
  { href: "/courses?exam=JEE Advanced", label: "JEE Advanced" },
  { href: "/courses?exam=NEET", label: "NEET UG" },
];

export function SiteHeader({
  userName,
}: {
  userName?: string | null;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#071228]/95 text-white backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Brand light />
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) =>
            link.href === "/courses" ? (
              <div key={link.href} className="group relative">
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white",
                    pathname.startsWith("/courses") && "text-white"
                  )}
                >
                  {link.label}
                  <ChevronDown className="size-3.5" />
                </Link>
                <div className="invisible absolute left-0 top-full z-20 min-w-40 rounded-xl border border-white/10 bg-[#0b1b3a] p-2 opacity-0 shadow-xl group-hover:visible group-hover:opacity-100">
                  {courseLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white",
                  (pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href))) &&
                    "text-white"
                )}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/sample-papers"
            className="hidden rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white sm:inline-flex"
            aria-label="Search sample papers"
          >
            <Search className="size-4" />
          </Link>
          {userName ? (
            <>
              <Link
                href="/dashboard"
                className="hidden text-sm text-white/80 hover:text-white sm:inline"
              >
                {userName}
              </Link>
              <form action={logoutAction}>
                <Button type="submit" variant="outline" className="h-9 border-white/20 bg-transparent text-white hover:bg-white/10">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "hidden h-9 text-white hover:bg-white/10 sm:inline-flex"
                )}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={cn(buttonVariants(), "h-9 bg-indigo-500 px-4 hover:bg-indigo-400")}
              >
                Sign Up
              </Link>
            </>
          )}
          <Sheet>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "lg:hidden text-white hover:bg-white/10"
              )}
            >
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0b1b3a] text-white">
              <SheetHeader>
                <SheetTitle className="text-white">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 px-4">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-lg px-2 py-2 text-white/90">
                    {link.label}
                  </Link>
                ))}
                <Link href="/login" className="rounded-lg px-2 py-2">
                  Login
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
