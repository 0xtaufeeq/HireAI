import { getUserRole } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SetupForm from "./setup-form";

export default async function RoleSetupPage() {
    const supabase = await createClient();

    const user_role = await getUserRole(supabase);
    if (user_role != "undefined") {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <div className="text-center">
                <SetupForm />
            </div>
        </div>
    );
}
