import type {
    InputHTMLAttributes,
    ReactNode,
    SelectHTMLAttributes,
    TextareaHTMLAttributes,
} from "react";

const control =
    "w-full rounded-xl border border-line-strong bg-white/5 px-4 py-3 text-base text-cream placeholder:text-dim transition-colors focus:border-lamp focus:outline-none focus:ring-2 focus:ring-lamp/30 aria-invalid:border-pink [color-scheme:dark]";

type Common = {
    id: string;
    label: string;
    error?: string;
    hint?: string;
    required?: boolean;
};

function Wrapper({
    id,
    label,
    error,
    hint,
    required,
    children,
}: Common & { children: ReactNode }) {
    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-[15px] font-medium">
                {label}
                {required && (
                    <span className="text-lamp" aria-hidden="true">
                        {" "}
                        *
                    </span>
                )}
            </label>
            {children}
            {hint && !error && (
                <p id={`${id}-hint`} className="mt-1.5 text-[13.5px] text-dim">
                    {hint}
                </p>
            )}
            {error && (
                <p id={`${id}-error`} className="mt-1.5 text-[13.5px] text-pink">
                    {error}
                </p>
            )}
        </div>
    );
}

function describedBy(id: string, error?: string, hint?: string) {
    if (error) return `${id}-error`;
    if (hint) return `${id}-hint`;
    return undefined;
}

export function TextField({
    id,
    label,
    error,
    hint,
    required,
    ...input
}: Common & Omit<InputHTMLAttributes<HTMLInputElement>, "id">) {
    return (
        <Wrapper id={id} label={label} error={error} hint={hint} required={required}>
            <input
                id={id}
                name={id}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy(id, error, hint)}
                className={control}
                {...input}
            />
        </Wrapper>
    );
}

export function SelectField({
    id,
    label,
    error,
    hint,
    required,
    options,
    ...select
}: Common &
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
        options: readonly string[];
    }) {
    return (
        <Wrapper id={id} label={label} error={error} hint={hint} required={required}>
            <select
                id={id}
                name={id}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy(id, error, hint)}
                className={`${control} [&>option]:bg-plum [&>option]:text-cream`}
                {...select}
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </Wrapper>
    );
}

export function TextAreaField({
    id,
    label,
    error,
    hint,
    required,
    ...area
}: Common & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id">) {
    return (
        <Wrapper id={id} label={label} error={error} hint={hint} required={required}>
            <textarea
                id={id}
                name={id}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy(id, error, hint)}
                className={`${control} min-h-32 resize-y`}
                {...area}
            />
        </Wrapper>
    );
}

/** A hidden field that only bots fill in. Real visitors never see it. */
export function HoneypotField() {
    return (
        <div
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        >
            <label>
                Leave this empty
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
        </div>
    );
}