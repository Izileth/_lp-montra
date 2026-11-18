export type LinkItem = { label: string; href: string };

export const BRAND = {
    name: "Montra",
    tagline: "O esplendor milenar das grandes árvores do mundo.",
    description:
        "Montra é um catálogo vivo e observatório botânico dedicado à catalogação, preservação e celebração das mais nobres espécies de árvores do planeta.",
    email: "contato@montra-arvores.org",
    phone: "+55 11 3200 4800",
    address: ["Reserva Florestal Mantiqueira", "São Paulo, SP · Brasil"],
    hours: [
        { day: "Ter – Sex", time: "09:00 – 18:00" },
        { day: "Sáb – Dom", time: "08:00 – 17:00" },
    ],
    timeZone: "America/Sao_Paulo",
    city: "São Paulo",
    year: new Date().getFullYear(),
};

export const NAV_LINKS: LinkItem[] = [
    { label: "Espécies", href: "#especies" },
    { label: "Herbário", href: "#herbario" },
    { label: "Biomas", href: "#biomas" },
    { label: "Conservação", href: "#conservacao" },
    { label: "Expedições", href: "#expedicoes" },
    { label: "Sobre", href: "#sobre" },
];

export const SOCIALS: LinkItem[] = [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Herbarium Digital", href: "https://gbif.org/" },
    { label: "Arquivo Científico", href: "https://jstor.org/" },
    { label: "Botanic Gardens", href: "https://bgci.org/" },
];

export const FOOTER_COLUMNS: { title: string; links: LinkItem[] }[] = [
    {
        title: "Espécies",
        links: [
            { label: "Grandes Coníferas", href: "#coniferas" },
            { label: "Folhosas Tropicais", href: "#tropicais" },
            { label: "Fósseis Vivos", href: "#fosseis" },
            { label: "Matas Nativas", href: "#nativas" },
        ],
    },
    {
        title: "Iniciativa",
        links: [
            { label: "Sobre a Montra", href: "#sobre" },
            { label: "Herbário Vivo", href: "#herbario" },
            { label: "Expedições", href: "#expedicoes" },
            { label: "Contato Científico", href: "#contact" },
        ],
    },
    {
        title: "Preservação",
        links: [
            { label: "Guia Dendrológico", href: "#guia" },
            { label: "Políticas de Manejo", href: "#manejo" },
            { label: "Créditos Botânicos", href: "#creditos" },
            { label: "Acesso Aberto", href: "#acesso" },
        ],
    },
];
