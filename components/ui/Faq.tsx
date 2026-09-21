type Item = { q: string; a: string };

/** Expandable questions. Uses plain <details>, so it works without JavaScript. */
export function Faq({ items }: { items: Item[] }) {
    return (
        <div className="border-b border-line">
            {items.map((item) => (
                <details key={item.q} className="group border-t border-line py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium [&::-webkit-details-marker]:hidden">
                        {item.q}
                        <svg
                            viewBox="0 0 24 24"
                            className="size-5 shrink-0 stroke-muted transition-transform group-open:rotate-180"
                            fill="none"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </summary>
                    <p className="mt-3 max-w-2xl text-[16.5px] text-muted">{item.a}</p>
                </details>
            ))}
        </div>
    );
}