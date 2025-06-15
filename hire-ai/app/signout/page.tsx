// remove in prod (rename page file to make it unaccessible)

import { createClient } from "@/utils/supabase/server";

export default async function SignOutPage() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Error signing out:", error);
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-red-500">
                    Failed to sign out. Please try again.
                </p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <p className="text-green-500">
                You have been signed out successfully.
            </p>
        </div>
    );
}
