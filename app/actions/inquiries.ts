"use server";

import { and, eq, gt, sql } from "drizzle-orm";
import { after } from "next/server";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { validateInquiry, type FormState, type InquiryKind } from "@/lib/inquiries";
import { sendInquiryEmail } from "@/lib/notify";

const MAX_PER_HOUR = 3;

export async function submitInquiry(
    _previous: FormState,
    formData: FormData,
): Promise<FormState> {
    // Read every text field and trim it
    const values: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
        if (typeof value === "string") values[key] = value.trim();
    }

    const kind = values.kind;
    if (kind !== "contact" && kind !== "quote") {
        return { status: "error", message: "Something went wrong. Please try again.", values };
    }
    const type: InquiryKind = kind;

    // Spam trap: real people never see this field, so a filled value means a bot.
    // Pretend it worked so the bot learns nothing.
    if (values.website) {
        return { status: "success", message: "Thank you.", whatsappText: "Hi MeepleMania!" };
    }

    const errors = validateInquiry(type, values);
    if (Object.keys(errors).length > 0) {
        return {
            status: "error",
            message: "Please check the highlighted fields.",
            errors,
            values,
        };
    }

    const details: Record<string, string> =
        type === "quote"
            ? {
                format: values.format,
                teamSize: values.teamSize,
                location: values.location,
                date: values.date ?? "",
                budget: values.budget,
            }
            : { topic: values.topic };

    const record = {
        kind: type,
        name: values.name,
        email: values.email || null,
        phone: values.phone || null,
        company: values.company || null,
        message: values.message || null,
        details,
    };

    try {
        // Limit repeat submissions from the same email or phone
        const since = new Date(Date.now() - 60 * 60 * 1000);
        const sameSender = values.email
            ? eq(inquiries.email, values.email)
            : eq(inquiries.phone, values.phone);
        const recent = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(inquiries)
            .where(and(sameSender, gt(inquiries.createdAt, since)));

        if ((recent[0]?.count ?? 0) >= MAX_PER_HOUR) {
            return {
                status: "error",
                message:
                    "We already have a few messages from you. Please message us on WhatsApp for a quicker reply.",
                values,
            };
        }

        await db.insert(inquiries).values(record);
    } catch (error) {
        console.error("Could not save inquiry", error);
        return {
            status: "error",
            message:
                "We could not save your message just now. Please message us on WhatsApp instead.",
            values,
        };
    }

    // Email the team after the visitor already has their answer. If the email
    // fails, the enquiry is still saved, so nothing is lost.
    after(async () => {
        try {
            await sendInquiryEmail(record);
        } catch (error) {
            console.error("Could not send the email alert", error);
        }
    });

    const whatsappText =
        type === "quote"
            ? `Hi MeepleMania, I just sent a quote request for a ${values.format.toLowerCase()} session for ${values.teamSize
            } people (${values.location})${values.date ? ` around ${values.date}` : ""
            }. My name is ${values.name} from ${values.company}.`
            : `Hi MeepleMania, I just sent a message about "${values.topic}". My name is ${values.name}.`;

    return {
        status: "success",
        message:
            type === "quote"
                ? "Thank you. We have your request and will come back to you with a proposal."
                : "Thank you. We have your message and will reply as soon as we can.",
        whatsappText,
    };
}