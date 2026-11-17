import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Progress from "./Progress";
// (remova: import Footer from "./Footer";)
type Item = {
    id: number;
    title: string[];
    by: string;
    date: string;
    time: string;
    city: string;
    bg: string;
    thumb: string;
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

const OFFSETS = [-4, -3, -2, -1, 0, 1, 2, 3, 4] as const;
const GAP = 2;

const prefersReduced = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function HarborEchoes() {
    const total = ITEMS.length;
    const [active, setActive] = useState(1);

    const root = useRef<HTMLElement>(null);
    const strip = useRef<HTMLDivElement>(null);
    const touchX = useRef<number | null>(null);
    const busy = useRef(false);
    const dirRef = useRef(1);
    const prevRef = useRef(1);
    const first = useRef(true);

    /* ---------- navegação ---------- */
    const goTo = useCallback((idx: number, dir: number) => {
        if (busy.current) return;
        busy.current = true;
        dirRef.current = dir;
        setActive(idx);
        // segurança: libera caso a animação não rode
        window.setTimeout(() => (busy.current = false), 1400);
    }, []);

    const go = useCallback(
        (dir: number) => goTo((active + dir + total) % total, dir),
        [active, total, goTo]
    );

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [go]);

    /* ---------- GSAP: intro ---------- */
    useLayoutEffect(() => {
        if (prefersReduced()) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.from(".js-header > *", { y: -24, opacity: 0, duration: 0.8, stagger: 0.1 })
                .from(".js-line", { yPercent: 110, duration: 1.1, stagger: 0.1, ease: "power4.out" }, 0.15)
                .from(".js-meta", { y: 14, opacity: 0, duration: 0.7, stagger: 0.06 }, 0.5)
                .from(
                    ".js-card",
                    { y: 60, opacity: 0, duration: 0.9, stagger: { each: 0.06, from: "center" } },
                    0.3
                )
                .from(".js-footer", { y: 20, opacity: 0, duration: 0.7 }, 0.9);

            gsap.fromTo(
                ".js-bg-active",
                { scale: 1.15 },
                { scale: 1, duration: 2, ease: "power2.out" }
            );
        }, root);

        return () => ctx.revert();
    }, []);

    /* ---------- GSAP: transição entre slides ---------- */
    useLayoutEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }

        if (prefersReduced()) {
            busy.current = false;
            prevRef.current = active;
            return;
        }

        const dir = dirRef.current;
        const prev = prevRef.current;

        const ctx = gsap.context(() => {
            const cardW =
                (strip.current?.firstElementChild as HTMLElement | null)?.getBoundingClientRect().width ?? 200;

            const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
                onComplete: () => {
                    busy.current = false;
                },
            });

            // fundo: crossfade + leve zoom
            tl.fromTo(`.js-bg-${prev}`, { opacity: 1 }, { opacity: 0, duration: 0.9, ease: "power2.inOut" }, 0)
                .fromTo(".js-bg-active", { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 1.4 }, 0)

                // faixa de cards desliza e o card central "abre" de cima para baixo
                .fromTo(strip.current, { x: dir * (cardW + GAP) }, { x: 0, duration: 0.9, ease: "power4.out" }, 0)
                .fromTo(
                    ".js-card-active",
                    { clipPath: "inset(0% 0% 100% 0%)" },
                    { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut" },
                    0
                )

                // título em máscara + meta
                .fromTo(".js-line", { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.08, ease: "power4.out" }, 0.1)
                .fromTo(".js-meta", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.05 }, 0.3);
        }, root);

        prevRef.current = active;
        return () => ctx.revert();
    }, [active]);

    const current = ITEMS[active];

    return (
        <main
            ref={root}
            className="relative h-[100svh] w-full select-none overflow-hidden bg-[#9a2220] text-white"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
                if (touchX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
                touchX.current = null;
            }}
        >
            {/* Fundos */}
            {ITEMS.map((item, i) => (
                <img
                    key={item.id}
                    src={item.bg}
                    alt=""
                    draggable={false}
                    className={`js-bg-${i} absolute inset-0 h-full w-full object-cover object-center ${i === active ? "js-bg-active z-[1] opacity-100" : "opacity-0"
                        }`}
                />
            ))}
            <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-br from-black/15 via-transparent to-black/10" />


            {/* Título + meta */}
            <section className="absolute inset-x-0 bottom-[calc(50%+20px)] z-10 px-4 md:px-[18px]">
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                    <h2 className="font-display text-[56px] font-medium leading-[0.88] tracking-[-0.045em] sm:text-[72px] lg:text-[84px]">
                        {current.title.map((line) => (
                            <span key={line} className="-my-[0.06em] block overflow-hidden py-[0.06em]">
                                <span className="js-line block">{line}</span>
                            </span>
                        ))}
                    </h2>

                    <div className="flex flex-1 flex-wrap items-end justify-between gap-x-6 gap-y-1 font-mono text-[10px] uppercase leading-none tracking-wide md:mb-[3px] md:flex-nowrap md:pl-[70px] md:text-[11px]">
                        <span className="js-meta">{current.by}</span>
                        <div className="flex gap-6 md:gap-[90px]">
                            <span className="js-meta">{current.date}</span>
                            <span className="js-meta">{current.time}</span>
                            <span className="js-meta">{current.city}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Faixa de cards */}
            <div className="absolute inset-x-0 top-1/2 z-10 [--w:40vw] sm:[--w:28vw] md:[--w:21vw] lg:[--w:15.2vw]">
                <div
                    ref={strip}
                    className="flex items-start"
                    style={{
                        gap: GAP,
                        marginLeft: `calc(50vw - ${4 * GAP}px - 4 * var(--w) - var(--w) / 2)`,
                    }}
                >
                    {OFFSETS.map((offset) => {
                        const idx = (active + offset + total) % total;
                        const item = ITEMS[idx];
                        const isActive = offset === 0;
                        return (
                            <button
                                key={offset}
                                type="button"
                                onClick={() => !isActive && goTo(idx, offset > 0 ? 1 : -1)}
                                aria-label={`${item.title.join(" ")} ${item.id}`}
                                style={{ width: "var(--w)" }}
                                className={`js-card relative shrink-0 overflow-hidden rounded-[3px] bg-black/20 ${isActive ? "js-card-active aspect-[180/243]" : "aspect-[182/122]"
                                    }`}
                            >
                                <img src={item.thumb} alt="" draggable={false} className="h-full w-full object-cover" />
                            </button>
                        );
                    })}
                </div>
            </div>

            <Progress active={active} total={total} onPrev={() => go(-1)} onNext={() => go(1)} />
        </main>
    );
}