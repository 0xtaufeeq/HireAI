import { CustomJwtPayload, getUserRole } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { redirect } from "next/navigation";

export default async function RootPage() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
        redirect("/login");
    }

    const userRole = await getUserRole(supabase);

    switch (userRole) {
        case "recruiter":
            redirect("/dashboard");
            break;
        case "candidate":
            redirect("/home");
            break;
        case "undefined":
            redirect("/setup");
        default:
            redirect("/error");
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to Hire AI</h1>
                <p className="text-lg text-gray-600">You shouldn't be here</p>
            </div>
        </div>
    );
}
