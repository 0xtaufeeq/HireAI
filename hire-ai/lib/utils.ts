import { clsx, type ClassValue } from "clsx";
import { JwtPayload } from "jwt-decode";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface CustomJwtPayload extends JwtPayload {
    user_role: string;
}
