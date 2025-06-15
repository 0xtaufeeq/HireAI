"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createClient } from "@/utils/supabase/client";
export default function SetupForm() {
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName || !role) {
            setError("Please fill in all fields.");
            return;
        }

        const supabase = createClient();

        // setting display name
        const data = {
            display_name: fullName,
        };
        const { error: nameError } = await supabase.auth.updateUser({ data });
        if (nameError) {
            setError("Failed to update profile. Please try again.");
            return;
        }

        // setting user role
        const { data: userData, error: userError } =
            await supabase.auth.getUser();
        const userId = userData.user?.id;
        const { error: roleError } = await supabase
            .from("user_roles")
            .update({ role: role })
            .eq("user_id", userId);

        if (roleError) {
            setError("Failed to set role. Please try again.");
            console.error(roleError);
            return;
        }

        await supabase.auth.refreshSession();

        router.push("/");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                />
            </div>

            <div className="space-y-3">
                <Label>Select your role</Label>
                <RadioGroup value={role} onValueChange={setRole}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="recruiter" id="recruiter" />
                        <Label htmlFor="recruiter">Recruiter</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="candidate" id="candidate" />
                        <Label htmlFor="candidate">Candidate</Label>
                    </div>
                </RadioGroup>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full">
                Complete Setup
            </Button>
        </form>
    );
}
