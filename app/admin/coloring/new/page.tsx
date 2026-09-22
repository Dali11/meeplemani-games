import type { Metadata } from "next";
import Link from "next/link";
import { ColoringForm } from "@/components/admin/ColoringForm";
import { requireAdmin } from "@/lib/admin-auth";
import { emptyColoringForm } from "@/lib/coloring-form";

export const metadata: Metadata = { title: "New category" };

export default async function NewColoringCategoryPage() {
    await requireAdmin();

    return (
        <div className="wrap py-10">
            <Link href="/admin/coloring" className="text-[15px] text-muted transition-colors hover:text-cream">
                &larr; All categories
            </Link>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">New category</h1>
            <div className="mt-8 max-w-3xl">
                <ColoringForm
                    defaults={{
                        ...emptyColoringForm,
                        sortOrder: null,
                    }}
                />
            </div>
        </div>
    );
}