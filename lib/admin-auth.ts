import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkToken, makeToken } from "@/lib/admin-crypto";

const COOKIE = "mm_admin";
const SESSION_SECONDS = 60 * 60 * 24 * 7; // 7 days

/** Has this browser logged in to the admin? */
export async function hasSession() {
    const token = (await cookies()).get(COOKIE)?.value;
    return checkToken(token, process.env.SESSION_SECRET);
}

/** Put this at the top of every admin page and admin action. */
export async function requireAdmin() {
    if (!(await hasSession())) redirect("/admin/login");
}

export async function startSession() {
    const secret = process.env.SESSION_SECRET;
    if (!secret) throw new Error("SESSION_SECRET is not set");

    (await cookies()).set(COOKIE, makeToken(secret, SESSION_SECONDS), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_SECONDS,
    });
}

export async function endSession() {
    (await cookies()).delete(COOKIE);
}