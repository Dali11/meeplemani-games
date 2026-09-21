import { sql } from "drizzle-orm";
import { db } from "./index";
import { galleryImages } from "./schema";

// Photos for the gallery page. The tag is the filter group: Game nights,
// Retreats, Corporate or Community. Files live in public/images/.
const photos = [
    { title: "Great Lake Escape 2025: beach", tag: "Retreats", imageUrl: "/images/gle-hero-beach.jpg" },
    { title: "Team Building Day", tag: "Corporate", imageUrl: "/images/gallery-corporate-teambuilding.jpg" },
    { title: "Mental Health Matters MW", tag: "Community", imageUrl: "/images/gallery-new-12.jpg" },
    { title: "Independence Trivia", tag: "Game nights", imageUrl: "/images/gallery-independence-trivia.jpg" },
    { title: "Kuwala Night", tag: "Game nights", imageUrl: "/images/gallery-kuwala-night.jpg" },
    { title: "Great Lake Escape 2025: boat trip", tag: "Retreats", imageUrl: "/images/gle-boat-trip.jpg" },
    { title: "Easter in Salima", tag: "Retreats", imageUrl: "/images/gallery-easter-salima.jpg" },
    { title: "Mental Health Matters MW", tag: "Community", imageUrl: "/images/gallery-new-14.jpg" },
    { title: "Valentine's Game Night", tag: "Game nights", imageUrl: "/images/gallery-valentines.jpg" },
    { title: "Community Gathering", tag: "Community", imageUrl: "/images/gallery-community.jpg" },
    { title: "Great Lake Escape 2025: limbo", tag: "Retreats", imageUrl: "/images/gle-limbo-game.jpg" },
    { title: "Board Game Night", tag: "Game nights", imageUrl: "/images/gallery-fb-event.jpg" },
    { title: "Game House Party", tag: "Game nights", imageUrl: "/images/gallery-houseparty.jpg" },
    { title: "Kids Fun Day", tag: "Community", imageUrl: "/images/gallery-kids-fun.jpg" },
    { title: "Mental Health Matters MW", tag: "Community", imageUrl: "/images/gallery-new-16.jpg" },
    { title: "Great Lake Escape 2025: movie night", tag: "Retreats", imageUrl: "/images/gle-movie-night.jpg" },
    { title: "Tabletop Tournament", tag: "Game nights", imageUrl: "/images/gallery-tournament.jpg" },
    { title: "Blantyre Meetup", tag: "Game nights", imageUrl: "/images/gallery-blantyre.jpg" },
    { title: "Great Lake Escape 2025: group photo", tag: "Retreats", imageUrl: "/images/gle-group-photo.jpg" },
    { title: "Birthday Game Night", tag: "Game nights", imageUrl: "/images/gallery-birthday-events.jpg" },
    { title: "Youth Connect", tag: "Community", imageUrl: "/images/gallery-youth-connect.jpg" },
    { title: "Mental Health Matters MW", tag: "Community", imageUrl: "/images/gallery-new-17.jpg" },
    { title: "Great Lake Escape 2025: road trip", tag: "Retreats", imageUrl: "/images/gle-roadtrip.jpg" },
    { title: "Great Lake Escape 2025: jump shot", tag: "Retreats", imageUrl: "/images/gle-jump-joy.jpg" },
    { title: "Mental Health Matters MW", tag: "Community", imageUrl: "/images/gallery-new-03.jpg" },
    { title: "Great Lake Escape 2025: on the road", tag: "Retreats", imageUrl: "/images/gle-jump-road.jpg" },
];

async function main() {
    // The gallery table has no unique key, so only fill it once
    const existing = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(galleryImages);

    if ((existing[0]?.count ?? 0) > 0) {
        console.log("The gallery already has photos. Nothing to do.");
        return;
    }

    await db.insert(galleryImages).values(
        photos.map((p, i) => ({ ...p, sortOrder: i + 1, status: "published" })),
    );
    console.log(`Added ${photos.length} photos to the gallery.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});