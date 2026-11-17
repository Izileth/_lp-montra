export type LinkItem = { label: string; href: string };

export const BRAND = {
    name: "Montra",
    tagline: "Sound, light and silhouettes after dark.",
    description:
        "Montra is a Berlin-based night platform curating showcases, listening sessions and live visuals with independent collectives.",
    email: "hello@montra.example",
    phone: "+49 30 0000 0000",
    address: ["Hafenstraße 12", "10243 Berlin, DE"],
    hours: [
        { day: "Thu – Sat", time: "10 PM – 6 AM" },
        { day: "Sun", time: "6 PM – 12 AM" },
    ],
    timeZone: "Europe/Berlin",
    city: "Berlin",
    year: new Date().getFullYear(),
};

export const NAV_LINKS: LinkItem[] = [
    { label: "Events", href: "#events" },
    { label: "Artists", href: "#artists" },
    { label: "Venues", href: "#venues" },
    { label: "Journal", href: "#journal" },
    { label: "Tickets", href: "#tickets" },
    { label: "About", href: "#about" },
];

export const SOCIALS: LinkItem[] = [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "SoundCloud", href: "https://soundcloud.com/" },
    { label: "YouTube", href: "https://youtube.com/" },
    { label: "Resident Advisor", href: "https://ra.co/" },
];

export const FOOTER_COLUMNS: { title: string; links: LinkItem[] }[] = [
    {
        title: "Explore",
        links: [
        { label: "Events", href: "#events" },
        { label: "Artists", href: "#artists" },
        { label: "Venues", href: "#venues" },
        { label: "Journal", href: "#journal" },
        ],
    },
    {
        title: "Company",
        links: [
        { label: "About", href: "#about" },
        { label: "Press kit", href: "#press" },
        { label: "Careers", href: "#careers" },
        { label: "Contact", href: "#contact" },
        ],
    },
    {
        title: "Legal",
        links: [
        { label: "Terms", href: "#terms" },
        { label: "Privacy", href: "#privacy" },
        { label: "Cookies", href: "#cookies" },
        { label: "Imprint", href: "#imprint" },
        ],
    },
];