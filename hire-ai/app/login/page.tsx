import { LoginForm } from "@/components/login-form";
import { CustomJwtPayload } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const getUserRole = async () => {
        const { data, error } = await supabase.auth.getSession();
        const jwt = data.session!.access_token;
        const decoded = jwtDecode<CustomJwtPayload>(jwt);
        const user_role: string = decoded.user_role;
        return user_role;
    };

    // check if already logged in
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (data.user) {
        const userRole = await getUserRole();

        switch (userRole) {
            case "recruiter":
                redirect("/dashboard");
                break;
            case "candidate":
                redirect("/home");
                break;
            default:
                redirect("/error");
        }
    }

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
    );
}
