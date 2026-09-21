export type QuoteFormat = "Half day" | "Full day" | "Retreat" | "Custom";

export type BenefitIcon = "users" | "puzzle" | "smile" | "leaf";

export const BENEFITS: { icon: BenefitIcon; title: string; text: string }[] = [
    {
        icon: "users",
        title: "Stronger collaboration",
        text: "Cooperative games make colleagues communicate, share roles and work toward one goal in a low-stakes setting.",
    },
    {
        icon: "puzzle",
        title: "Sharper problem-solving",
        text: "Tactical play builds strategic decisions, analytical thinking and creative answers under pressure.",
    },
    {
        icon: "smile",
        title: "Real camaraderie",
        text: "Shared laughter and friendly competition break down the walls between departments.",
    },
    {
        icon: "leaf",
        title: "A proper mental reset",
        text: "Time away from screens and email helps ease burnout and keeps people engaged.",
    },
];

export const PACKAGES: {
    format: Exclude<QuoteFormat, "Custom">;
    name: string;
    label: string;
    blurb: string;
    features: string[];
    popular?: boolean;
}[] = [
        {
            format: "Half day",
            name: "Team Connect",
            label: "Half-day session",
            blurb:
                "Ideal for office game afternoons, end-of-quarter socials and team icebreakers.",
            features: [
                "3 to 4 hours, fully facilitated",
                "Icebreaker and party board games",
                "10 to 50 participants",
                "At your office or a partner venue",
            ],
        },
        {
            format: "Full day",
            name: "Team Challenge",
            label: "Full-day event",
            blurb:
                "A full day of structured, competitive board gaming, strategy tournaments and team challenges.",
            features: [
                "6 to 8 hours of play",
                "Team tournament and trophy presentation",
                "Custom business-simulated board games",
                "15 to 100+ participants",
            ],
            popular: true,
        },
        {
            format: "Retreat",
            name: "Team Experience",
            label: "Multi-day retreat",
            blurb:
                "A premium off-site retreat that mixes outdoor adventure, board games and leadership bonding.",
            features: [
                "2 to 3 day destination retreat",
                "Lake Malawi, Dzalanyama and more",
                "Full transport, lodging and catering",
                "Evening socials, water relays and games",
            ],
        },
    ];

export const EVERY_PACKAGE = [
    "Professional facilitation",
    "Game equipment and library",
    "Full venue setup",
    "Customised activities",
    "Team challenges",
    "Prizes and trophies",
    "Photo highlights",
    "Optional catering coordination",
];

export const STEPS = [
    {
        title: "Tell us about your team",
        text: "Share your team size, goals, date and place. The quote builder below takes two minutes.",
    },
    {
        title: "We design the session",
        text: "We match games and challenges to what you want your team to get out of the day.",
    },
    {
        title: "We run it",
        text: "Our facilitators bring the equipment, set up the venue and keep the energy up.",
    },
    {
        title: "Debrief and photos",
        text: "You get a short debrief with team insights, plus photo highlights to share.",
    },
];

export const AUDIENCE = [
    "HR managers and people operations",
    "CEOs and managing directors",
    "NGO directors and project leads",
    "Corporate communications and culture leads",
];

export const SECTORS = [
    "Banking and finance",
    "Telecoms and tech",
    "International NGOs",
    "Insurance",
    "Hospitality and tourism",
    "Government and parastatals",
];


/** The three short rows shown in the home page team section */
export const CORPORATE_TIERS: { label: string; description: string }[] = [
    {
        label: "Half day",
        description:
            "3 to 4 hours of icebreakers and party games for 10 to 50 people.",
    },
    {
        label: "Full day",
        description:
            "6 to 8 hours of strategy tournaments and a trophy presentation for 15 to 100+ people.",
    },
    {
        label: "Retreat",
        description:
            "2 to 3 days at Lake Malawi or Dzalanyama, with transport, lodging and catering.",
    },
];