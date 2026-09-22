import { db } from "./index";
import { events, type NewEventRow } from "./schema";

// Starting data for the site. Safe to run more than once: rows whose slug
// already exists are skipped, so edits you make later are never overwritten.
// The two past events (July and August 2026) are saved as "archived" so they
// do not show up as upcoming.
const rows: NewEventRow[] = [
    {
        title: "The Great Lake Escape",
        slug: "the-great-lake-escape",
        description: "3 days of sun, sand, strategy, board games, water sports, and networking by Lake Malawi. 3 installments available.",
        location: "Mangochi, Lake Malawi",
        dateLabel: "30 Oct to 1 Nov 2026",
        startsAt: new Date("2026-10-30T00:00:00+02:00"),
        category: "Adventure",
        categoryColor: "#3b82f6",
        price: "MK400,000 per person",
        priceNote: "Pay in 3 installments",
        imageUrl: "/images/gle-hero-beach.jpg",
        highlights: [
            "3 days and 2 nights at a lakeside resort in Mangochi",
            "Curated board game library with 50+ titles",
            "Water sports: kayaking, swimming, beach volleyball",
            "Evening game tournaments with prizes",
            "All meals and accommodation included",
            "Networking with Malawi's board game community",
            "Board game workshops for all skill levels",
        ],
        schedule: [
            { day: "Day 1", items: ["Arrival and check-in", "Welcome briefing and icebreaker games", "Dinner and casual game night"] },
            { day: "Day 2", items: ["Morning board game tournaments", "Lakeside water sports", "Afternoon strategy game sessions", "Evening social and prize ceremony"] },
            { day: "Day 3", items: ["Morning nature walk", "Final tournament round", "Awards and closing ceremony", "Checkout"] },
        ],
        faq: [
            { q: "Is accommodation included?", a: "Yes, all meals and lodging at the lakeside resort are included in the package price." },
            { q: "Do I need to know how to play board games?", a: "Not at all. We have games for all skill levels and facilitators to teach you." },
            { q: "How do I get there?", a: "Transport to Mangochi is self-arranged, but we can help coordinate shared transport from Lilongwe and Blantyre." },
            { q: "Can I pay in installments?", a: "Yes, 3 installments are available. Contact us on WhatsApp to arrange a payment plan." },
        ],
        galleryImages: ["/images/gle-hero-beach.jpg", "/images/gle-lakeside-group.jpg"],
        organizerName: "Legendary Adventures",
        organizerBio:
            "This trip is co-hosted with Legendary Adventures, our partner for transport and the beachfront stay in Mangochi. They handle the road logistics and the lakeside resort, while MeepleMania Games brings the games, the tournaments and the hosting.",
        organizerTags: ["Transport", "Beachfront Accommodation", "Lake Malawi Specialists"],
        status: "published",
        sortOrder: 1,
    },
    {
        title: "Dress for the Wrong Occasion",
        slug: "dress-for-the-wrong-occasion",
        description: "Wear a tux to board games or beachwear to chess! Hilarious themed party game night filled with laughter and prizes.",
        location: "Kuwala Gardens, Lilongwe",
        dateLabel: "Date coming soon",
        startsAt: null,
        category: "Game Night",
        categoryColor: "#d94a8a",
        price: "MK8,000",
        priceNote: null,
        imageUrl: "/images/bg-home-hero.jpg",
        highlights: [
            "Themed dress code: wear the wrong outfit for the occasion",
            "Party board games and group activities",
            "Prizes for best (worst) outfit",
            "Snacks and drinks included",
            "Open to individuals, couples, and groups",
        ],
        schedule: [
            { day: "Event Night", items: ["Doors open and outfit judging", "Icebreaker party games", "Tournament rounds", "Prize ceremony and social"] },
        ],
        faq: [
            { q: "What should I wear?", a: "Anything delightfully wrong. A tuxedo for board games, beachwear for chess, a onesie for trivia. The more mismatched, the better." },
            { q: "Is there food?", a: "Yes, snacks and drinks are included in the ticket price." },
            { q: "Can I come alone?", a: "Absolutely. Many attendees come solo and we'll match you with a group." },
        ],
        galleryImages: null,
        status: "published",
        sortOrder: 2,
    },
    {
        title: "Couples Mountain Retreat",
        slug: "couples-mountain-retreat",
        description: "Cozy weekend escape featuring couples cooperative board games campfire bonding nature walks and stargazing.",
        location: "Dzalanyama Forest Reserve",
        dateLabel: "Aug 1-2 2026",
        startsAt: new Date("2026-08-01T00:00:00+02:00"),
        category: "Adventure",
        categoryColor: "#10b981",
        price: "Price TBA",
        priceNote: null,
        imageUrl: "/images/gle-lakeside-group.jpg",
        highlights: [
            "Weekend retreat at Dzalanyama Forest Reserve",
            "Couples cooperative board games",
            "Campfire bonding and storytelling",
            "Nature walks and birdwatching",
            "Stargazing session",
            "Meals and cabin accommodation included",
        ],
        schedule: [
            { day: "Day 1", items: ["Arrival and cabin check-in", "Welcome couples game session", "Campfire dinner and bonding"] },
            { day: "Day 2", items: ["Morning nature walk", "Cooperative game tournament", "Afternoon free time", "Evening stargazing"] },
        ],
        faq: [
            { q: "Is this only for couples?", a: "Yes, this retreat is designed for couples looking for a unique bonding experience." },
            { q: "What kind of games will we play?", a: "Cooperative board games where you and your partner work together to win." },
        ],
        galleryImages: null,
        status: "archived",
        sortOrder: 3,
    },
    {
        title: "Independence Day Trivia Night",
        slug: "independence-day-trivia-night",
        description: "Celebrate Malawi's heritage with team trivia pop culture rounds strategy board games and food specials.",
        location: "Villa 33 / Kuwala Gardens",
        dateLabel: "July 2026",
        startsAt: null,
        category: "Game Night",
        categoryColor: "#f59e0b",
        price: "MK8,000 (Early Bird)",
        priceNote: null,
        imageUrl: "/images/gallery-independence-trivia.jpg",
        highlights: [
            "Malawi heritage and culture trivia rounds",
            "Pop culture and entertainment trivia",
            "Strategy board game stations",
            "Food and drink specials",
            "Team-based competition with prizes",
            "Open to all ages",
        ],
        schedule: [
            { day: "Event Night", items: ["Doors open and team registration", "Heritage trivia rounds", "Board game stations", "Finals and prize ceremony"] },
        ],
        faq: [
            { q: "How big can a team be?", a: "Teams of 2 to 6 people. Come with a group or join one on the night." },
            { q: "Is there an early bird price?", a: "Yes, early bird tickets are MK8,000. Regular price applies closer to the event." },
        ],
        galleryImages: null,
        status: "archived",
        sortOrder: 4,
    },
    {
        title: "Corporate Team-Building",
        slug: "corporate-team-building",
        description: "Boost collaboration problem-solving and team morale through tailored game challenges and retreats.",
        location: "Lilongwe, Blantyre or your venue",
        dateLabel: "Book any date",
        startsAt: null,
        category: "Corporate",
        categoryColor: "#6366f1",
        price: "Custom quote",
        priceNote: null,
        imageUrl: "/images/gallery-tournament.jpg",
        highlights: [
            "Tailored game challenges for your team size and goals",
            "Professional facilitation and game equipment",
            "Choose from half-day, full-day, or multi-day retreat formats",
            "Available in Lilongwe, Blantyre, or custom venues",
            "Optional catering and venue coordination",
            "Post-event debrief and team insights",
        ],
        schedule: [
            { day: "Custom", items: ["Schedule is tailored to your team's needs and chosen package"] },
        ],
        faq: [
            { q: "What team sizes do you accommodate?", a: "From 10 to 100+ participants. We scale the game selection and facilitation accordingly." },
            { q: "Can you come to our office?", a: "Yes, we can host at your office or arrange an off-site venue." },
            { q: "Do you offer multi-day retreats?", a: "Yes, our Team Experience package is a 2-3 day destination retreat." },
        ],
        galleryImages: null,
        status: "published",
        sortOrder: 5,
    },
    {
        title: "Kids Fun Day",
        slug: "kids-fun-day",
        description: "Family-friendly afternoon of interactive kids board games puzzles mini-tournaments and wholesome fun.",
        location: "Venue coming soon",
        dateLabel: "Date coming soon",
        startsAt: null,
        category: "Game Night",
        categoryColor: "#f59e0b",
        price: "Price coming soon",
        priceNote: null,
        imageUrl: "/images/gallery-kids-fun.jpg",
        highlights: [
            "Interactive kids board games and puzzles",
            "Mini-tournaments with age-appropriate prizes",
            "Hands-on game learning stations",
            "Family-friendly atmosphere",
            "Snacks and refreshments included",
        ],
        schedule: [
            { day: "Event Day", items: ["Welcome and game stations open", "Mini-tournament rounds", "Snack break", "Final rounds and prizes"] },
        ],
        faq: [
            { q: "What ages is this for?", a: "Designed for children aged 6-14, with games scaled to different age groups." },
            { q: "Do parents need to stay?", a: "Parents are welcome to stay and join in, but supervision is provided by our facilitators." },
        ],
        galleryImages: null,
        status: "published",
        sortOrder: 6,
    },
];

async function main() {
    const inserted = await db
        .insert(events)
        .values(rows)
        .onConflictDoNothing({ target: events.slug })
        .returning({ slug: events.slug });

    console.log(`Seeded ${inserted.length} new event(s) out of ${rows.length}.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});