import { createClient } from "@/utils/supabase/server";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { redirect } from "next/navigation";
import { Header } from "./header";
import { getUserRole } from "@/lib/utils";

interface CustomJwtPayload extends JwtPayload {
    user_role: string;
}

export default async function CandidateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
        redirect("/login");
    }

    if ((await getUserRole(supabase)) != "candidate") {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen w-full">
            <div className="flex-1 flex flex-col">
                <Header />
                <div className="flex-1 p-6 bg-background">{children}</div>
            </div>
        </div>
    );
}
