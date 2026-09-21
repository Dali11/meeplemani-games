"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitInquiry } from "@/app/actions/inquiries";
import { CONTACT_TOPICS, initialFormState } from "@/lib/inquiries";
import { whatsappLink } from "@/lib/site";
import { SuccessPanel } from "./SuccessPanel";
import { HoneypotField, TextAreaField, TextField } from "./Fields";

const MAX_MESSAGE = 1000;

export function ContactForm({ defaultTopic }: { defaultTopic?: string }) {
    // Changing the key starts a fresh form (used by "Send another message")
    const [round, setRound] = useState(0);
    return (
        <ContactFormInner
            key={round}
            defaultTopic={defaultTopic}
            onReset={() => setRound((r) => r + 1)}
        />
    );
}

function ContactFormInner({
    defaultTopic,
    onReset,
}: {
    defaultTopic?: string;
    onReset: () => void;
}) {
    const [state, action, pending] = useActionState(submitInquiry, initialFormState);
    const [topic, setTopic] = useState<string>(
        (CONTACT_TOPICS as readonly string[]).includes(defaultTopic ?? "")
            ? (defaultTopic as string)
            : CONTACT_TOPICS[0],
    );
    const [length, setLength] = useState(0);

    const errors = state.errors ?? {};
    const values = state.values ?? {};

    if (state.status === "success") {
        return (
            <SuccessPanel
                title="Message sent"
                message={state.message ?? "Thank you."}
                whatsappText={state.whatsappText ?? "Hi MeepleMania!"}
                resetLabel="Send another message"
                onReset={onReset}
            />
        );
    }

    return (
        <form action={action} noValidate className="relative grid gap-5">
            <input type="hidden" name="kind" value="contact" />
            <HoneypotField />

            {state.status === "error" && state.message && (
                <div
                    role="alert"
                    className="rounded-xl border border-pink/50 bg-pink/10 px-4 py-3 text-[15px]"
                >
                    {state.message}{" "}

                <a   href={whatsappLink("Hi MeepleMania!")}
                    className="font-semibold underline underline-offset-4"
                >
                    Message us on WhatsApp
                </a>
        </div>
    )
}

      <fieldset>
        <legend className="mb-2 text-[15px] font-medium">What is this about?</legend>
        <div className="flex flex-wrap gap-2">
          {CONTACT_TOPICS.map((t) => (
            <label key={t} className="cursor-pointer">
              <input
                type="radio"
                name="topic"
                value={t}
                checked={topic === t}
                onChange={() => setTopic(t)}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-10 items-center rounded-full border border-line-strong px-4 text-[15px] text-muted transition-colors hover:text-cream peer-checked:border-cream peer-checked:bg-cream peer-checked:font-medium peer-checked:text-[#1b1630] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-lamp">
                {t}
              </span>
            </label>
          ))}
        </div>
        {errors.topic && <p className="mt-1.5 text-[13.5px] text-pink">{errors.topic}</p>}

        {topic === "Corporate team-building" && (
          <p className="mt-3 rounded-xl border border-line bg-white/5 px-4 py-3 text-[15px] text-muted">
            For a team day or retreat, our{" "}
            <Link
              href="/corporate#quote"
              className="font-semibold text-cream underline underline-offset-4"
            >
              quote builder
            </Link>{" "}
            gets us everything we need in one go.
          </p>
        )}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="name"
          label="Your name"
          required
          autoComplete="name"
          defaultValue={values.name}
          error={errors.name}
        />
        <TextField
          id="phone"
          label="Phone or WhatsApp"
          type="tel"
          autoComplete="tel"
          defaultValue={values.phone}
          error={errors.phone}
        />
      </div>

      <TextField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        defaultValue={values.email}
        error={errors.email}
        hint="Add an email, a phone number, or both."
      />

      <div>
        <TextAreaField
          id="message"
          label="Your message"
          required
          maxLength={MAX_MESSAGE}
          defaultValue={values.message}
          onChange={(e) => setLength(e.target.value.length)}
          error={errors.message}
        />
        <p className="mt-1.5 text-right font-meta text-[13px] text-dim" aria-hidden="true">
          {length} / {MAX_MESSAGE}
        </p>
      </div>

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-lamp px-6 text-base font-semibold text-[#1b1206] transition-colors hover:bg-lamp-bright disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Sending..." : "Send message"}
        </button>
      </div>
    </form >
  );
}