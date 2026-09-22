import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ColoringWallForm } from "@/components/admin/ColoringWallForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getColoringSubmissionById } from "@/lib/admin-queries";
import { deleteColoringSubmission } from "../actions";


export const metadata: Metadata = { title: "Edit photo" };

export default async function EditColoringSubmissionPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ created?: string }>;
}) {
    await requireAdmin();

    const { id } = await params;
    const { created } = await searchParams;
    const submission = await getColoringSubmissionById(id);
    if (!submission) notFound();

    return (
        <div className="wrap py-10">
            <Link href="/admin/coloring-wall" className="text-[15px] text-muted transition-colors hover:text-cream">
                &larr; Coloring wall
            </Link>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">
                    {submission.childName || "Untitled photo"}
                </h1>
                {submission.status === "published" && (
                    <a
                        href="/coloring-books"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[15px] text-lamp underline underline-offset-4"
                    >
                        View live page
                    </a>
                )}
            </div>

            {created === "1" && (
                <p role="status" className="mt-4 max-w-3xl rounded-xl border border-mint/40 bg-mint/10 px-4 py-3 text-[15px]">
                    Photo added.
                </p>
            )}

            <div className="mt-8 max-w-3xl">
                <ColoringWallForm
                    defaults={{
                        id: submission.id,
                        childName: submission.childName ?? "",
                        childAge: submission.childAge ?? "",
                        imageUrl: submission.imageUrl,
                        status: submission.status,
                        sortOrder: submission.sortOrder,
                    }}
                />

                <details className="mt-8 border-t border-line pt-6 text-[14px]">
                    <summary className="w-fit cursor-pointer list-none text-dim transition-colors hover:text-pink [&::-webkit-details-marker]:hidden">
                        Delete this photo
                    </summary>
                    <form action={deleteColoringSubmission} className="mt-3 flex items-center gap-3">
                        <input type="hidden" name="id" value={submission.id} />
                        <span className="text-muted">This removes it from the site. This cannot be undone.</span>
                        <button
                            type="submit"
                            className="rounded-full border border-pink/60 px-4 py-1.5 text-pink transition-colors hover:bg-pink/10"
                        >
                            Yes, delete it
                        </button>
                    </form>
                </details>
            </div>
        </div>
    );
}