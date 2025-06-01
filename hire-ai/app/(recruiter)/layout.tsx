import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex-1 flex flex-col">
                <Header />
                <div className="flex-1 p-6 bg-background">{children}</div>
              </div>
            </div>
          </SidebarProvider>
  );
}
