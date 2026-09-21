"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

const initial: LoginState = {};

export function LoginForm() {
    const [state, action, pending] = useActionState(login, initial);

    return (
        <form action={action} className="grid gap-5">
            <div>
                <label htmlFor="password" className="mb-1.5 block text-[15px] font-medium">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    autoFocus
                    aria-invalid={state.error ? true : undefined}
                    aria-describedby={state.error ? "login-error" : undefined}
                    className="w-full rounded-xl border border-line-strong bg-white/5 px-4 py-3 text-base text-cream focus:border-lamp focus:outline-none focus:ring-2 focus:ring-lamp/30 aria-invalid:border-pink"
                />
                {state.error && (
                    <p id="login-error" role="alert" className="mt-2 text-[14px] text-pink">
                        {state.error}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={pending}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-lamp px-6 text-base font-semibold text-[#1b1206] transition-colors hover:bg-lamp-bright disabled:cursor-wait disabled:opacity-60"
            >
                {pending ? "Checking..." : "Log in"}
            </button>
        </form>
    );
}