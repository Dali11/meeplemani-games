import { Resend } from "resend";

export type InquiryEmail = {
    kind: "contact" | "quote";
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    message: string | null;
    details: Record<string, string>;
};

/** Keeps a value on one line so it cannot break the subject or the layout */
const oneLine = (text: string) => text.replace(/[\r\n]+/g, " ").trim();

/** A WhatsApp link, only when the number was typed in international form (+265...) */
function whatsappFor(phone: string | null) {
    if (!phone || !phone.trim().startsWith("+")) return null;
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 8 ? `https://wa.me/${digits}` : null;
}

function buildSubject(i: InquiryEmail) {
    const subject =
        i.kind === "quote"
            ? `New quote request: ${i.company ?? i.name} (${i.details.teamSize} people, ${i.details.format})`
            : `New message: ${i.details.topic} from ${i.name}`;
    return oneLine(subject).slice(0, 150);
}

function buildText(i: InquiryEmail) {
    const received = new Date().toLocaleString("en-GB", {
        timeZone: "Africa/Blantyre",
        dateStyle: "medium",
        timeStyle: "short",
    });

    const lines: string[] = [
        i.kind === "quote" ? "New corporate quote request" : "New message from the website",
        `Received: ${received}`,
        "",
        `Name: ${i.name}`,
    ];
    if (i.company) lines.push(`Company: ${i.company}`);
    lines.push(`Email: ${i.email ?? "not given"}`);
    lines.push(`Phone: ${i.phone ?? "not given"}`);
    const wa = whatsappFor(i.phone);
    if (wa) lines.push(`WhatsApp: ${wa}`);
    lines.push("");

    if (i.kind === "quote") {
        lines.push(`Format: ${i.details.format}`);
        lines.push(`Team size: ${i.details.teamSize} people`);
        lines.push(`Where: ${i.details.location}`);
        lines.push(`Preferred date: ${i.details.date || "not given"}`);
        lines.push(`Budget: ${i.details.budget}`);
    } else {
        lines.push(`Topic: ${i.details.topic}`);
    }

    if (i.message) {
        lines.push("", "Message:", i.message);
    }

    lines.push(
        "",
        "---",
        i.email
            ? "Reply to this email to answer the sender directly."
            : "The sender gave no email, so please reply by phone or WhatsApp.",
    );
    return lines.join("\n");
}

/**
 * Emails the team about a new enquiry. Throws if the email could not be sent,
 * so the caller can log it. The enquiry itself is already saved by then.
 */
export async function sendInquiryEmail(inquiry: InquiryEmail): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;
    const to = (process.env.NOTIFY_EMAIL ?? "")
        .split(",")
        .map((address) => address.trim())
        .filter(Boolean);

    if (!apiKey || to.length === 0) {
        console.warn("Email alert skipped: RESEND_API_KEY or NOTIFY_EMAIL is not set.");
        return;
    }

    const from =
        process.env.EMAIL_FROM ?? "MeepleMania Website <onboarding@resend.dev>";

    const { error } = await new Resend(apiKey).emails.send({
        from,
        to,
        replyTo: inquiry.email ?? undefined,
        subject: buildSubject(inquiry),
        text: buildText(inquiry),
    });

    if (error) {
        throw new Error(`Resend could not send the email: ${error.message}`);
    }
}