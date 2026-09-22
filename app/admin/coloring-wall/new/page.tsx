import type { Metadata } from "next";
import Link from "next/link";
import { ColoringWallForm } from "@/components/admin/ColoringWallForm";
import { requireAdmin } from "@/lib/admin-auth";
import { emptySubmissionForm } from "@/lib/coloring-submission-form";

export const metadata: Metadata = { title: "Add a photo" };

export default async function NewColoringSubmissionPage() {
    await requireAdmin();

    return (
        <div className="wrap py-10">
            <Link href="/admin/coloring-wall" className="text-[15px] text-muted transition-colors hover:text-cream">
                &larr; Coloring wall
            </Link>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">Add a photo</h1>
            <div className="mt-8 max-w-3xl">
                <ColoringWallForm
                    defaults={{
                        ...emptySubmissionForm,
                        sortOrder: null,
                    }}
                />
            </div>
        </div>
    );
}