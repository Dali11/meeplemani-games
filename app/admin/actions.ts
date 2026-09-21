"use server";

import { and, eq, gt, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { inquiries, loginAttempts } from "@/db/schema";
import { checkPassword } from "@/lib/admin-crypto";
import { STATUSES, type InquiryStatus } from "@/lib/admin-queries";
import { endSession, requireAdmin, startSession } from "@/lib/admin-auth";

export type LoginState = { error?: string };

const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MINUTES = 15;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function login(
    _previous: LoginState,
    formData: FormData,
): Promise<LoginState> {
    if (!process.env.ADMIN_PASSWORD_HASH || !process.env.SESSION_SECRET) {
        return {
            error:
                "Admin login is not set up yet. Add ADMIN_PASSWORD_HASH and SESSION_SECRET to the environment variables.",
        };
    }

    const password = String(formData.get("password") ?? "");
    const forwarded = (await headers()).get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    // Too many wrong passwords from this address recently?
    const since = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000);
    const recent = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(loginAttempts)
        .where(and(eq(loginAttempts.ip, ip), gt(loginAttempts.createdAt, since)));

    if ((recent[0]?.count ?? 0) >= MAX_FAILED_LOGINS) {
        return {
            error: `Too many wrong passwords. Please wait ${LOCKOUT_MINUTES} minutes and try again.`,
        };
    }

    if (!checkPassword(password, process.env.ADMIN_PASSWORD_HASH)) {
        await db.insert(loginAttempts).values({ ip });
        await new Promise((resolve) => setTimeout(resolve, 600)); // slows down guessing
        return { error: "That password is not right." };
    }

    await db.delete(loginAttempts).where(eq(loginAttempts.ip, ip));
    await startSession();
    redirect("/admin");
}

export async function logout() {
    await endSession();
    redirect("/admin/login");
}

export async function updateInquiryStatus(formData: FormData) {
    await requireAdmin();

    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "");
    if (!UUID.test(id) || !(STATUSES as readonly string[]).includes(status)) return;

    await db
        .update(inquiries)
        .set({ status: status as InquiryStatus })
        .where(eq(inquiries.id, id));

    revalidatePath("/admin");
}

export async function deleteInquiry(formData: FormData) {
    await requireAdmin();

    const id = String(formData.get("id") ?? "");
    if (!UUID.test(id)) return;

    await db.delete(inquiries).where(eq(inquiries.id, id));
    revalidatePath("/admin");
}