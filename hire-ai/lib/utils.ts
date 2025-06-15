import { clsx, type ClassValue } from "clsx";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface CustomJwtPayload extends JwtPayload {
    user_role: string;
}

export async function getUserRole(supabase: SupabaseClient) {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
        redirect("/login");
        return null;
    }
    const jwt = data.session!.access_token;
    const decoded = jwtDecode<CustomJwtPayload>(jwt);
    const user_role: string = decoded.user_role;
    return user_role;
}
