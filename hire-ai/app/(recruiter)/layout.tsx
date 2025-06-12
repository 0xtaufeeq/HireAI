import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { create } from "domain";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
    user_role: string;
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    const getUserRole = async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
            redirect("/login");
            return null;
        }
        const jwt = data.session!.access_token;
        const decoded = jwtDecode<CustomJwtPayload>(jwt);
        const user_role: string = decoded.user_role;
        return user_role;
    };

    if (error || !data.user) {
        redirect("/login");
    }

    if ((await getUserRole()) != "recruiter") {
        redirect("/");
    }

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
