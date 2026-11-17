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
  tone: string;    // cor de fundo editorial deste slide
};

// 👉 Troque textos e caminhos pelos seus
const DATA = [
  { title: ["Harbor", "Echoes"], by: "By Void Division", date: "Fri Apr 18", time: "10–2 AM", city: "Berlin", tone: "#9a2220" },
  { title: ["Night", "Signal"], by: "By Hollow Unit", date: "Sat Apr 19", time: "11–5 AM", city: "Berlin", tone: "#8a1d1c" },
  { title: ["Glass", "Tide"], by: "By Mono Index", date: "Fri Apr 25", time: "10–3 AM", city: "Hamburg", tone: "#a4281f" },
  { title: ["Low", "Orbit"], by: "By Serein", date: "Sat Apr 26", time: "9–2 AM", city: "Leipzig", tone: "#7c1a1d" },
  { title: ["Red", "Static"], by: "By Void Division", date: "Fri May 02", time: "10–2 AM", city: "Berlin", tone: "#93211b" },
  { title: ["Soft", "Voltage"], by: "By Paper Ghost", date: "Sat May 03", time: "11–6 AM", city: "Munich", tone: "#a02a22" },
  { title: ["Dead", "Air"], by: "By Hollow Unit", date: "Fri May 09", time: "10–4 AM", city: "Berlin", tone: "#841d1a" },
  { title: ["Afterimage"], by: "By Mono Index", date: "Sat May 10", time: "12–6 AM", city: "Cologne", tone: "#982426" },
  { title: ["Last", "Light"], by: "By Serein", date: "Sun May 11", time: "6–12 AM", city: "Berlin", tone: "#8c1f1e" },
];

export const SLIDES: Slide[] = DATA.map((d, i) => ({
  ...d,
  id: i + 1,
  bg: `/images/bg-${i + 1}.jpg`,
  thumb: `/images/thumb-${i + 1}.jpg`,
  alt: `Retrato editorial: ${d.title.join(" ")}`,
}));