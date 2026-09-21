import { getPublishedEvents } from "@/lib/queries";

// Always ask the database, so this test page never shows old data
export const dynamic = "force-dynamic";

export default async function DbTest() {
    const events = await getPublishedEvents();

    return (
        <div className="wrap py-16">
            <h1 className="text-3xl font-semibold">Database check</h1>
            <p className="mt-2 font-meta text-muted">
                {events.length} published events loaded from Neon.
            </p>

            <ul className="mt-8 space-y-3 font-meta text-sm text-muted">
                {events.map((e) => (
                    <li key={e.id}>
                        <span className="text-cream">{e.title}</span> | {e.category} |{" "}
                        {e.dateLabel} | {e.price}
                    </li>
                ))}
            </ul>
        </div>
    );
}