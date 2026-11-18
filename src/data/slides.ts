export type Slide = {
  id: number;
  title: string[]; // uma entrada por linha do título
  by: string;
  date: string;
  time: string;
  city: string;
  bg: string;      // foto de fundo (tela cheia)
  thumb: string;   // foto do card (retrato)
  alt: string;
  tone: string;    // cor de fundo editorial deste slide (paleta verde)
};

// Espécies de árvore catalogadas com a paleta oficial:
// 1. #051F20 – Verde-escuro muito profundo
// 2. #0B2B26 – Verde-escuro profundo / Verde-floresta escuro
// 3. #163832 – Verde-escuro fechado
// 4. #235347 – Verde-esmeralda escuro / Verde-militar fechado
// 5. #8EB69B – Verde-sálvia claro / Verde-suave
// 6. #DAF1DE – Verde-pálido / Menta muito claro

const DATA: Omit<Slide, "id" | "alt">[] = [
  {
    title: ["Sequóia", "Gigante"],
    by: "Sequoiadendron giganteum",
    date: "Longevidade · +3.000 anos",
    time: "Porte · até 85m",
    city: "Sierra Nevada · EUA",
    tone: "#051F20",
    bg: "https://images.unsplash.com/photo-1461397821064-32d6b3c91b9f?auto=format&fit=crop&w=2000&q=85",
    thumb: "https://images.unsplash.com/photo-1461397821064-32d6b3c91b9f?auto=format&fit=crop&w=600&h=800&q=80",
  },
  {
    title: ["Carvalho", "Centenário"],
    by: "Quercus robur",
    date: "Longevidade · 1.000 anos",
    time: "Copa Frondosa · 40m",
    city: "Florestas Temperadas",
    tone: "#0B2B26",
    bg: "https://images.unsplash.com/photo-1773148374420-d40f365a9d88?auto=format&fit=crop&w=2000&q=85",
    thumb: "https://images.unsplash.com/photo-1773148374420-d40f365a9d88?auto=format&fit=crop&w=600&h=800&q=80",
  },
  {
    title: ["Cedro do", "Líbano"],
    by: "Cedrus libani",
    date: "Madeira Aromática & Nobre",
    time: "Altitude · 1.800m",
    city: "Montanhas do Levante",
    tone: "#163832",
    bg: "https://images.unsplash.com/photo-1749766731360-48040f37427d?q=80&w=771&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    thumb: "https://images.unsplash.com/photo-1749766731360-48040f37427d?q=80&w=771&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    title: ["Araucária", "Pinheiro"],
    by: "Araucaria angustifolia",
    date: "Fóssil Vivo · Mesozoico",
    time: "Copa Candelabro · 50m",
    city: "Mata Atlântica · Brasil",
    tone: "#235347",
    bg: "https://images.unsplash.com/photo-1565626571703-65f9128c1050?auto=format&fit=crop&w=2000&q=85",
    thumb: "https://images.unsplash.com/photo-1565626571703-65f9128c1050?auto=format&fit=crop&w=600&h=800&q=80",
  },
  {
    title: ["Baobá", "Ancestral"],
    by: "Adansonia digitata",
    date: "Guardião de Água · 120 mil L",
    time: "Circunferência · 30m",
    city: "Madagáscar & África",
    tone: "#051F20",
    bg: "https://images.unsplash.com/photo-1570742544137-3a469196c32b?auto=format&fit=crop&w=2000&q=85",
    thumb: "https://images.unsplash.com/photo-1585335740623-f7a1f0c446eb?auto=format&fit=crop&w=600&h=800&q=80",
  },
  {
    title: ["Bétula", "Prateada"],
    by: "Betula pendula",
    date: "Casca Alva & Sedosa",
    time: "Resistência ao Gelo",
    city: "Taiga Boreal & Tundra",
    tone: "#0B2B26",
    bg: "https://images.unsplash.com/photo-1758818248575-0ef54d6e2d62?auto=format&fit=crop&w=2000&q=85",
    thumb: "https://images.unsplash.com/photo-1777297821410-fb6da7341de9?auto=format&fit=crop&w=600&h=800&q=80",
  },
  {
    title: ["Oliveira", "Milenar"],
    by: "Olea europaea",
    date: "Raízes de 2.000 Anos",
    time: "Tronco Contorcido",
    city: "Bacia do Mediterrâneo",
    tone: "#163832",
    bg: "https://images.unsplash.com/photo-1639220448675-8c01fdb446fb?auto=format&fit=crop&w=2000&q=85",
    thumb: "https://images.unsplash.com/photo-1770337497084-c499feb9bc2b?auto=format&fit=crop&w=600&h=800&q=80",
  },
  {
    title: ["Pau", "Brasil"],
    by: "Paubrasilia echinata",
    date: "Madeira Vermelha & Resinosa",
    time: "Patrimônio Botânico",
    city: "Costa Leste Brasileira",
    tone: "#235347",
    bg: "https://images.unsplash.com/photo-1679310290857-d52802538880?auto=format&fit=crop&w=2000&q=85",
    thumb: "https://commons.wikimedia.org/wiki/Special:FilePath/Caesalpinia_echinata_-_Paubrasil.jpg?width=800",
  },
  {
    title: ["Ginkgo", "Ancestral"],
    by: "Ginkgo biloba",
    date: "270 Milhões de Anos",
    time: "Folhas Douradas em Leque",
    city: "Cordilheiras Orientais",
    tone: "#0B2B26",
    bg: "https://images.unsplash.com/photo-1766643475835-2a28a1987eab?auto=format&fit=crop&w=2000&q=85",
    thumb: "https://images.unsplash.com/photo-1636279129141-7dcc8861172d?auto=format&fit=crop&w=600&h=800&q=80",
  },
];

export const SLIDES: Slide[] = DATA.map((d, i) => ({
  ...d,
  id: i + 1,
  alt: `Espécime botânico: ${d.title.join(" ")} (${d.by})`,
}));
