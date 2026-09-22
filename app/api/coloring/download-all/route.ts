import JSZip from "jszip";
import { NextResponse } from "next/server";
import { getDownloadableColoringCategories } from "@/lib/queries";

export const runtime = "nodejs";
// Rebuild the ZIP at most once every 5 minutes, matching the page's own cache
export const revalidate = 300;

function filenameFor(title: string, usedNames: Set<string>) {
    const base =
        title
            .toLowerCase()
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || "coloring-set";

    let name = `${base}.pdf`;
    let n = 2;
    while (usedNames.has(name)) {
        name = `${base}-${n}.pdf`;
        n += 1;
    }
    usedNames.add(name);
    return name;
}

export async function GET() {
    const categories = await getDownloadableColoringCategories().catch(() => []);

    if (categories.length === 0) {
        return NextResponse.json(
            { error: "No coloring sets are ready to download yet." },
            { status: 404 },
        );
    }

    const zip = new JSZip();
    const usedNames = new Set<string>();
    let added = 0;

    for (const category of categories) {
        if (!category.downloadUrl) continue;

        try {
            const res = await fetch(category.downloadUrl);
            if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);

            const bytes = await res.arrayBuffer();
            zip.file(filenameFor(category.title, usedNames), bytes);
            added += 1;
        } catch (error) {
            // Skip a set that can't be fetched right now rather than failing the whole ZIP
            console.error(`Could not add "${category.title}" to the coloring ZIP`, error);
        }
    }

    if (added === 0) {
        return NextResponse.json(
            { error: "The coloring sets could not be downloaded right now. Please try again shortly." },
            { status: 502 },
        );
    }

    const bytes = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
    const blob = new Blob([bytes.slice()], { type: "application/zip" });

    return new NextResponse(blob, {
        headers: {
            "Content-Type": "application/zip",
            "Content-Disposition": 'attachment; filename="meeplemania-coloring-books.zip"',
            "Cache-Control": "public, max-age=300",
        },
    });
}