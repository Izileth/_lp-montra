import { useCallback, useEffect, useRef, useState } from "react";

type Item = {
    id: number;
    title: string[];      // linhas do título
    by: string;
    date: string;
    time: string;
    city: string;
    bg: string;           // imagem de fundo (tela cheia)
    thumb: string;        // imagem do card
};

// 👉 Substitua pelos seus arquivos
const ITEMS: Item[] = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    title: ["Harbor", "Echoes"],
    by: "By Void Division",
    date: "Fri Apr 18",
    time: "10–2 AM",
    city: "Berlin",
    bg: `/images/bg-${i + 1}.jpg`,
    thumb: `/images/thumb-${i + 1}.jpg`,
}));

const VISIBLE_OFFSETS = [-4, -3, -2, -1, 0, 1, 2, 3, 4] as const;
const GAP = 2; // px

const pad = (n: number) => String(n).padStart(2, "0");

export default function HarborEchoes() {
    const total = ITEMS.length;
    const [active, setActive] = useState<number>(1); // "02"
    const touchX = useRef<number | null>(null);

    const go = useCallback(
        (dir: number) => setActive((a) => (a + dir + total) % total),
        [total]
    );

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [go]);

    const current = ITEMS[active];
    const trackW = 100 - 14; // % disponível para o segmento de progresso

    return (
        <main
        className="relative h-[100svh] w-full overflow-hidden bg-[#9a2220] text-white select-none"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            touchX.current = null;
        }}
        >
        {/* Fundos (crossfade) */}
        {ITEMS.map((item, i) => (
            <img
            key={item.id}
            src={item.bg}
            alt=""
            draggable={false}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
                i === active ? "opacity-100" : "opacity-0"
            }`}
            />
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/15 via-transparent to-black/10" />

        {/* Header */}
        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-[18px] md:justify-center md:gap-[86px]">
            <button
            type="button"
            className="flex items-center gap-1.5 rounded-full bg-black/15 px-3 py-[7px] font-mono text-[11px] uppercase leading-none tracking-wide backdrop-blur-sm transition hover:bg-black/30"
            >
            <span aria-hidden>↖</span> Back
            </button>

            <h1 className="font-logo text-[20px] uppercase leading-none tracking-tight">
            Montra
            </h1>

            <button
            type="button"
            className="flex items-center gap-1.5 rounded-full bg-black/15 px-3 py-[7px] font-mono text-[11px] uppercase leading-none tracking-wide backdrop-blur-sm transition hover:bg-black/30"
            >
            Menu <span aria-hidden>≡</span>
            </button>
        </header>

        {/* Título + meta (logo acima da faixa de cards) */}
        <section className="absolute inset-x-0 bottom-[calc(50%+20px)] z-10 px-4 md:px-[18px]">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <h2
                className="font-display text-[56px] font-medium leading-[0.88] tracking-[-0.045em] sm:text-[72px] lg:text-[84px]"
            >
                {current.title.map((line) => (
                <span key={line} className="block">
                    {line}
                </span>
                ))}
            </h2>

            <div className="flex flex-1 flex-wrap items-end justify-between gap-x-6 gap-y-1 font-mono text-[10px] uppercase leading-none tracking-wide md:mb-[3px] md:flex-nowrap md:pl-[70px] md:text-[11px]">
                <span>{current.by}</span>
                <div className="flex gap-6 md:gap-[90px]">
                <span>{current.date}</span>
                <span>{current.time}</span>
                <span>{current.city}</span>
                </div>
            </div>
            </div>
        </section>

        {/* Faixa de cards */}
        <div className="absolute inset-x-0 top-1/2 z-10 [--w:40vw] sm:[--w:28vw] md:[--w:21vw] lg:[--w:15.2vw]">
            <div
            className="flex items-start transition-transform duration-500 ease-out"
            style={{
                gap: GAP,
                transform: `translateX(calc(50vw - ${4 * GAP}px - 4 * var(--w) - var(--w) / 2))`,
            }}
            >
            {VISIBLE_OFFSETS.map((offset) => {
                const idx = (active + offset + total) % total;
                const item = ITEMS[idx];
                const isActive = offset === 0;
                return (
                <button
                    key={offset}
                    type="button"
                    onClick={() => setActive(idx)}
                    aria-label={`${item.title.join(" ")} ${pad(item.id)}`}
                    style={{ width: "var(--w)" }}
                    className={`relative shrink-0 overflow-hidden rounded-[3px] bg-black/20 transition-[aspect-ratio] duration-500 ${
                    isActive ? "aspect-[180/243]" : "aspect-[182/122]"
                    }`}
                >
                    <img
                    src={item.thumb}
                    alt=""
                    draggable={false}
                    className="h-full w-full object-cover"
                    />
                </button>
                );
            })}
            </div>
        </div>

        {/* Progresso */}
        <footer className="absolute bottom-[15px] left-[15px] z-20 w-[min(254px,calc(100%-30px))] font-mono text-[10px] leading-none tracking-wide">
            <div className="mb-2 flex justify-between">
            <span>{pad(active + 1)}</span>
            <span>{pad(total)}</span>
            </div>
            <div className="relative h-px w-full bg-white/35">
            <div
                className="absolute -top-px h-[3px] bg-white transition-[left] duration-500"
                style={{
                width: "14%",
                left: `${(active / (total - 1)) * trackW}%`,
                }}
            />
            </div>
        </footer>
        </main>
    );
}