import { Check } from "lucide-react";
import { Pill } from "@/components/ui/Pill";
import { whatsappLink } from "@/lib/site";

type Props = {
    title: string;
    message: string;
    whatsappText: string;
    resetLabel: string;
    onReset: () => void;
};

export function SuccessPanel({
    title,
    message,
    whatsappText,
    resetLabel,
    onReset,
}: Props) {
    return (
        <div
            role="status"
            className="rounded-[22px] border border-mint/40 bg-mint/10 p-6 sm:p-8"
        >
            <div className="flex size-11 items-center justify-center rounded-full bg-mint/20">
                <Check className="size-5 text-mint" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">{title}</h3>
            <p className="mt-2 max-w-lg text-muted">{message}</p>
            <p className="mt-2 max-w-lg text-muted">
                For the fastest reply, you can also send us a short note on WhatsApp.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
                <Pill href={whatsappLink(whatsappText)} variant="wa">
                    Continue on WhatsApp
                </Pill>
                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex min-h-11 items-center rounded-full border border-line-strong bg-white/5 px-5 font-semibold text-cream transition-colors hover:bg-white/10"
                >
                    {resetLabel}
                </button>
            </div>
        </div>
    );
}