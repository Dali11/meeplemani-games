import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { hasSession } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage() {
    if (await hasSession()) redirect("/admin");

    return (
        <div className="wrap py-16 sm:py-24">
            <div className="mx-auto w-full max-w-sm rounded-[22px] border border-line bg-plum p-7">
                <h1 className="text-2xl font-semibold tracking-tight">Admin log in</h1>
                <p className="mt-2 mb-6 text-[15.5px] text-muted">
                    Enter the admin password to see your requests.
                </p>
                <LoginForm />
            </div>
        </div>
    );
}