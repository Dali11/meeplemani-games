export type InquiryKind = "contact" | "quote";

export type FormState = {
    status: "idle" | "error" | "success";
    message?: string;
    errors?: Record<string, string>;
    values?: Record<string, string>;
    whatsappText?: string;
};

export const initialFormState: FormState = { status: "idle" };

export const CONTACT_TOPICS = [
    "General enquiry",
    "Event booking",
    "Corporate team-building",
    "Partnership or sponsorship",
    "Media or press",
] as const;

export const QUOTE_FORMATS = ["Half day", "Full day", "Retreat", "Custom"] as const;

export const QUOTE_LOCATIONS = [
    "Lilongwe",
    "Blantyre",
    "Off-site resort (for example Lake Malawi)",
    "Not sure yet",
] as const;

export const QUOTE_BUDGETS = [
    "Prefer not to say",
    "Under MK500,000",
    "MK500,000 to MK1,000,000",
    "MK1,000,000 to MK2,000,000",
    "MK2,000,000 or more",
] as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s()-]{7,20}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function oneOf(list: readonly string[], value: string) {
    return list.includes(value);
}

/** Returns a map of field name to error message. An empty map means the form is valid. */
export function validateInquiry(
    kind: InquiryKind,
    v: Record<string, string>,
): Record<string, string> {
    const get = (key: string) => v[key] ?? "";
    const errors: Record<string, string> = {};

    const name = get("name");
    if (name.length < 2 || name.length > 80) {
        errors.name = "Please enter your name.";
    }

    const email = get("email");
    const phone = get("phone");
    if (email && !EMAIL.test(email)) errors.email = "That email address does not look right.";
    if (phone && !PHONE.test(phone)) errors.phone = "That phone number does not look right.";
    if (!email && !phone) {
        errors.email = "Add an email or a phone number so we can reply.";
    }

    const message = get("message");
    if (message.length > 2000) errors.message = "Please keep this under 2000 characters.";

    if (kind === "contact") {
        if (!oneOf(CONTACT_TOPICS, get("topic"))) errors.topic = "Please choose a topic.";
        if (message.length < 10) errors.message = "Please tell us a little more (at least 10 characters).";
    }

    if (kind === "quote") {
        const company = get("company");
        if (company.length < 2 || company.length > 100) {
            errors.company = "Please enter your company or organisation.";
        }
        if (!oneOf(QUOTE_FORMATS, get("format"))) errors.format = "Please choose a format.";
        if (!oneOf(QUOTE_LOCATIONS, get("location"))) errors.location = "Please choose a location.";
        if (!oneOf(QUOTE_BUDGETS, get("budget"))) errors.budget = "Please choose a budget range.";
        const size = Number(get("teamSize"));
        if (!Number.isInteger(size) || size < 5 || size > 500) {
            errors.teamSize = "Please choose your team size.";
        }
        const date = get("date");
        if (date && !DATE.test(date)) errors.date = "Please use a valid date.";
    }

    return errors;
}