import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ColoringForm } from "@/components/admin/ColoringForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getColoringCategoryById } from "@/lib/admin-queries";
import { deleteColoringCategory } from "../actions";

export const metadata: Metadata = { title: "Edit category" };

export default async function EditColoringCategoryPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ created?: string }>;
}) {
    await requireAdmin();

    const { id } = await params;
    const { created } = await searchParams;
    const category = await getColoringCategoryById(id);
    if (!category) notFound();

    return (
        <div className="wrap py-10">
            <Link href="/admin/coloring" className="text-[15px] text-muted transition-colors hover:text-cream">
                &larr; All categories
            </Link>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">{category.title}</h1>
                {category.status === "published" && (

                    <a href="/coloring-books"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[15px] text-lamp underline underline-offset-4"
                    >
                        View live page
                    </a>
                )}
            </div>

            {
                created === "1" && (
                    <p role="status" className="mt-4 max-w-3xl rounded-xl border border-mint/40 bg-mint/10 px-4 py-3 text-[15px]">
                        Category created.
                    </p>
                )
            }

            <div className="mt-8 max-w-3xl">
                <ColoringForm
                    defaults={{
                        id: category.id,
                        title: category.title,
                        slug: category.slug,
                        description: category.description ?? "",
                        imageUrl: category.imageUrl ?? "",
                        downloadUrl: category.downloadUrl ?? "",
                        status: category.status,
                        sortOrder: category.sortOrder,
                        ageRange: category.ageRange ?? "",
                        pageCount: category.pageCount != null ? String(category.pageCount) : "",
                        difficulty: category.difficulty ?? "",
                        badge: category.badge ?? "",
                        priceMwk: category.priceMwk != null ? String(category.priceMwk) : "",
                    }}
                />

                <details className="mt-8 border-t border-line pt-6 text-[14px]">
                    <summary className="w-fit cursor-pointer list-none text-dim transition-colors hover:text-pink [&::-webkit-details-marker]:hidden">
                        Delete this category
                    </summary>
                    <form action={deleteColoringCategory} className="mt-3 flex items-center gap-3">
                        <input type="hidden" name="id" value={category.id} />
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
        </div >
    );
}