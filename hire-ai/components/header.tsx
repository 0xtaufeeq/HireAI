"use client"

import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between gap-4 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 px-3 sticky top-0 z-50">
      <SidebarTrigger className="icon-elegant focus-elegant" />

      {/* <div className="flex-1 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Quick search candidates..." className="pl-10" />
        </div>
      </div> */}

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <Button 
          variant="ghost" 
          size="icon" 
          className="button-elegant relative focus-elegant"
        >
          <Bell className="h-4 w-4 icon-elegant" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-[10px] bg-primary text-primary-foreground border-0 notification-pulse">
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="button-elegant relative h-8 w-8 rounded-full focus-elegant"
            >
              <Avatar className="h-8 w-8 ring-0 transition-all duration-300 hover:ring-2 hover:ring-primary/20">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                  JD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="dropdown-elegant w-56 border-border/60 bg-card/95 backdrop-blur-md" 
            align="end" 
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground/70">john@company.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem className="cursor-pointer transition-all duration-200 hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer transition-all duration-200 hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary">
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem className="cursor-pointer transition-all duration-200 hover:bg-destructive/5 hover:text-destructive focus:bg-destructive/5 focus:text-destructive">
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
