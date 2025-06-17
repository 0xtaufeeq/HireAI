"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, GraduationCap, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function SetupForm() {
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName || !role) {
            setError("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        setError("");

        const supabase = createClient();

        try {
            // setting display name
            const data = {
                display_name: fullName,
            };
            const { error: nameError } = await supabase.auth.updateUser({
                data,
            });
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
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const roleOptions = [
        {
            value: "recruiter",
            title: "Recruiter",
            description: "I'm looking to hire talent",
            icon: Briefcase,
            gradient: "from-blue-500 to-purple-600",
        },
        {
            value: "candidate",
            title: "Candidate",
            description: "I'm looking for opportunities",
            icon: GraduationCap,
            gradient: "from-green-500 to-teal-600",
        },
    ];

    return (
        <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2 text-primary">
                    Welcome! Let's get you set up.
                </h1>
                <p className="text-gray-400">
                    Tell us a bit about yourself to personalize your experience
                </p>
            </div>

            <Card className="shadow-xl bg-card border-2">
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Full Name Input */}
                        <div className="space-y-3">
                            <Label
                                htmlFor="fullName"
                                className="text-base font-medium"
                            >
                                Full Name
                            </Label>
                            <Input
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                                className="h-12 text-base border-2"
                            />
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-4">
                            <Label className="text-base font-medium">
                                What best describes you?
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {roleOptions.map((option) => {
                                    const IconComponent = option.icon;
                                    const isSelected = role === option.value;

                                    return (
                                        <Card
                                            key={option.value}
                                            className={`relative cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                                                isSelected
                                                    ? "border-green-500 shadow-lg"
                                                    : "border-2 hover:border-gray-300"
                                            }`}
                                            onClick={() =>
                                                setRole(option.value)
                                            }
                                        >
                                            <CardContent className="p-6 text-center">
                                                {/* Selected Indicator */}
                                                {isSelected && (
                                                    <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                        <Check className="w-4 h-4 text-white" />
                                                    </div>
                                                )}

                                                {/* Icon with Gradient Background */}
                                                <div
                                                    className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${option.gradient} flex items-center justify-center`}
                                                >
                                                    <IconComponent className="w-10 h-10 text-white" />
                                                </div>

                                                {/* Title and Description */}
                                                <h3 className="text-xl font-semibold mb-2">
                                                    {option.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm">
                                                    {option.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-600 text-sm font-medium">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-medium bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transition-all duration-200"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Setting up your account...
                                </div>
                            ) : (
                                "Complete Setup"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
