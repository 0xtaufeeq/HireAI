"use client"

import { Brain, Users, FileText, BarChart3, Mail, Database, Search, Settings, Home, Target, Badge } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Search Candidates",
    url: "/search",
    icon: Search,
  },
  {
    title: "Candidate Pool",
    url: "/candidates",
    icon: Users,
  },
  {
    title: "Resume Parser",
    url: "/resume-parser",
    icon: FileText,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Outreach",
    url: "/outreach",
    icon: Mail,
  },
  {
    title: "Talent Pool",
    url: "/talent-pool",
    icon: Database,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-border/40 bg-card/50 backdrop-blur-md">
      <SidebarHeader className="p-4 bg-card/80 border-b border-border/30">
        <div className="flex items-center gap-3 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
            <Brain className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors duration-300">
              HireAI
            </span>
            <span className="text-xs text-muted-foreground/60">AI Hiring Platform</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-card/30 p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/70 text-xs font-medium px-2 py-2 uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item, index) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`
                        nav-elegant group transition-all duration-300 rounded-md mx-1
                        hover:bg-primary/5 hover:text-primary 
                        data-[active=true]:bg-primary data-[active=true]:text-primary-foreground 
                        data-[active=true]:shadow-md data-[active=true]:shadow-primary/20
                        focus-elegant
                      `}
                      data-active={isActive}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: `elegant-fade-in 400ms var(--ease-out-cubic) forwards`,
                        opacity: 0
                      }}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5 rounded-md w-full">
                        <item.icon className="h-4 w-4 icon-elegant transition-colors duration-200" />
                        <span className="font-medium text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 bg-card/80 border-t border-border/30">
        <div className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-200 cursor-default">
          © 2025 HireAI Platform
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
