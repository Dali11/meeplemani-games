import { sql } from "drizzle-orm";
import { db } from "./index";
import { coloringCategories } from "./schema";

// Starting categories for the coloring books page. Swap in real illustration
// photos and PDF links from the admin panel once they're ready.
const categories = [
    {
        title: "Board Game Friends",
        slug: "board-game-friends",
        description: "Dice, meeples and game pieces to color in, for our smallest players.",
        imageUrl: "/images/gallery-tournament.jpg",
    },
    {
        title: "Lake Malawi Adventure",
        slug: "lake-adventure",
        description: "Boats, beach games and lakeside scenes inspired by the Great Lake Escape.",
        imageUrl: "/images/gle-hero-beach.jpg",
    },
    {
        title: "Kids Fun Day",
        slug: "kids-fun-day",
        description: "Party hats, balloons and games from our family and kids events.",
        imageUrl: "/images/gallery-kids-fun.jpg",
    },
    {
        title: "MeepleMania Mascots",
        slug: "meeplemania-mascots",
        description: "Our own characters, ready to be filled in with color.",
        imageUrl: "/images/gallery-community.jpg",
    },
];

async function main() {
    // Rows whose slug already exists are skipped, so edits made later in the
    // admin panel are never overwritten by re-running this script.
    const existing = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(coloringCategories);

    if ((existing[0]?.count ?? 0) > 0) {
        console.log("The coloring page already has categories. Nothing to do.");
        return;
    }

    await db.insert(coloringCategories).values(
        categories.map((c, i) => ({ ...c, sortOrder: i + 1, status: "published" })),
    );
    console.log(`Added ${categories.length} coloring categories.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});