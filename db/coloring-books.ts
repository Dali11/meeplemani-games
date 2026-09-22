export type ColoringCategory = {
    slug: string;
    title: string;
    description: string;
    image: string;
    /** Path to a printable PDF, once one exists. Leave undefined to show "Coming soon". */
    downloadUrl?: string;
};

export const COLORING_CATEGORIES: ColoringCategory[] = [
    {
        slug: "board-game-friends",
        title: "Board Game Friends",
        description: "Dice, meeples and game pieces to color in, for our smallest players.",
        image: "/images/gallery-tournament.jpg",
    },
    {
        slug: "lake-adventure",
        title: "Lake Malawi Adventure",
        description: "Boats, beach games and lakeside scenes inspired by the Great Lake Escape.",
        image: "/images/gle-hero-beach.jpg",
    },
    {
        slug: "kids-fun-day",
        title: "Kids Fun Day",
        description: "Party hats, balloons and games from our family and kids events.",
        image: "/images/gallery-kids-fun.jpg",
    },
    {
        slug: "meeplemania-mascots",
        title: "MeepleMania Mascots",
        description: "Our own characters, ready to be filled in with color.",
        image: "/images/gallery-community.jpg",
    },
];