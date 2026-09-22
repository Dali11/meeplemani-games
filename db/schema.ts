import {
    pgTable,
    uuid,
    text,
    integer,
    jsonb,
    timestamp,
    index,
} from "drizzle-orm/pg-core";

export type ScheduleDay = { day: string; items: string[] };
export type FaqItem = { q: string; a: string };

const timestamps = {
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
};

export const events = pgTable(
    "events",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        title: text("title").notNull(),
        slug: text("slug").notNull().unique(),
        description: text("description").notNull(),
        location: text("location"),
        dateLabel: text("date_label"),
        startsAt: timestamp("starts_at", { withTimezone: true }),
        category: text("category"),
        categoryColor: text("category_color"),
        price: text("price"),
        priceNote: text("price_note"),
        imageUrl: text("image_url"),
        detailUrl: text("detail_url"),
        whatsappUrl: text("whatsapp_url"),
        highlights: jsonb("highlights").$type<string[]>(),
        schedule: jsonb("schedule").$type<ScheduleDay[]>(),
        faq: jsonb("faq").$type<FaqItem[]>(),
        organizerName: text("organizer_name"),
        organizerBio: text("organizer_bio"),
        organizerTags: jsonb("organizer_tags").$type<string[]>(),
        galleryImages: jsonb("gallery_images").$type<string[]>(),
        status: text("status").notNull().default("published"),
        sortOrder: integer("sort_order").notNull().default(0),
        ...timestamps,
    },
    (t) => [
        index("idx_events_status").on(t.status),
        index("idx_events_sort_order").on(t.sortOrder),
    ],
);

export const blogPosts = pgTable(
    "blog_posts",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        title: text("title").notNull(),
        slug: text("slug").notNull().unique(),
        excerpt: text("excerpt"),
        content: text("content"),
        coverImage: text("cover_image"),
        author: text("author").default("MeepleMania Games"),
        category: text("category"),
        status: text("status").notNull().default("draft"),
        publishedAt: timestamp("published_at", { withTimezone: true }),
        ...timestamps,
    },
    (t) => [index("idx_blog_posts_status").on(t.status)],
);

export const galleryImages = pgTable(
    "gallery_images",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        title: text("title").notNull(),
        tag: text("tag"),
        imageUrl: text("image_url").notNull(),
        sortOrder: integer("sort_order").notNull().default(0),
        status: text("status").notNull().default("published"),
        ...timestamps,
    },
    (t) => [
        index("idx_gallery_images_status").on(t.status),
        index("idx_gallery_images_sort_order").on(t.sortOrder),
    ],
);

export const inquiries = pgTable(
    "inquiries",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        kind: text("kind").notNull(),
        name: text("name").notNull(),
        email: text("email"),
        phone: text("phone"),
        company: text("company"),
        message: text("message"),
        details: jsonb("details").$type<Record<string, string>>(),
        status: text("status").notNull().default("new"),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => [
        index("idx_inquiries_status").on(t.status),
        index("idx_inquiries_created_at").on(t.createdAt),
    ],
);


export const loginAttempts = pgTable(
    "login_attempts",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        ip: text("ip").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => [index("idx_login_attempts_ip_created").on(t.ip, t.createdAt)],
);


export const coloringCategories = pgTable(
    "coloring_categories",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        title: text("title").notNull(),
        slug: text("slug").notNull().unique(),
        description: text("description"),
        imageUrl: text("image_url"),
        downloadUrl: text("download_url"),
        status: text("status").notNull().default("draft"),
        sortOrder: integer("sort_order").notNull().default(0),
        ...timestamps,
    },
    (t) => [
        index("idx_coloring_categories_status").on(t.status),
        index("idx_coloring_categories_sort_order").on(t.sortOrder),
    ],
);


export type EventRow = typeof events.$inferSelect;
export type NewEventRow = typeof events.$inferInsert;
export type ColoringCategoryRow = typeof coloringCategories.$inferSelect;
export type NewColoringCategoryRow = typeof coloringCategories.$inferInsert;