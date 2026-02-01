"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, User, LogOut, ChevronDown, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";

interface HeaderProps {
  onLoginClick: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export function Header({ onLoginClick, searchQuery, setSearchQuery }: HeaderProps) {
  const { data: session, status } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isSearchOpen) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-5xl items-center gap-2 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(false)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Cari Game atau Voucher"
              className="w-full pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery?.(e.target.value)}
            />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">UTD</span>
          <span className="text-xl font-bold text-foreground">Games</span>
        </div>

        <div className="flex items-center gap-2">
          {setSearchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-secondary" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2 hover:bg-secondary"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      src={session.user.image || ""}
                      alt={session.user.name || "User"}
                      referrerPolicy="no-referrer"
                      className="aspect-square size-full object-cover"
                    />
                    <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                      {session.user.name
                        ? getInitials(session.user.name)
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-[120px] truncate text-sm font-medium text-foreground sm:inline">
                    {session.user.name || "User"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="truncate text-sm font-medium text-foreground">
                    {session.user.name}
                  </p>
                  {session.user.email && (
                    <p className="truncate text-xs text-muted-foreground">
                      {session.user.email}
                    </p>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onLoginClick}
              className="flex items-center gap-2 border-primary/50 bg-transparent text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
