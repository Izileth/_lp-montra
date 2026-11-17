import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Navbar from "./Navbar";
import { SLIDES } from "../data/slides";
import { createCarouselMotion, type CarouselMotion } from "../motion/carousel";

const START = 1; // começa no slide "02", como no design
const pad = (n: number) => String(n).padStart(2, "0");

// grão de filme bem discreto (SVG inline, sem requisição extra)
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const ctrl =
  "flex h-7 w-7 items-center justify-center rounded-full bg-black/15 font-mono text-[12px] leading-none backdrop-blur-sm hover:bg-black/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function HarborEchoes() {
  const root = useRef<HTMLElement>(null);
  const motion = useRef<CarouselMotion | null>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      const m = createCarouselMotion({ root: root.current, slides: SLIDES, start: START });
      motion.current = m;
      return () => m.destroy();
    },
    { scope: root }
  );

  const total = SLIDES.length;

  return (
    <main
      ref={root}
      className="relative h-[100svh] min-h-[560px] w-full select-none overflow-hidden overscroll-x-none bg-[#9a2220] text-white"
    >
      {/* Fundos (camadas empilhadas, reveladas por máscara) */}
      <div data-bg-stack className="absolute inset-0 isolate will-change-transform">
        {SLIDES.map((s, i) => (
          <div key={s.id} data-bg className="absolute inset-0 overflow-hidden">
            <img
              data-bg-img
              src={s.bg}
              alt=""
              aria-hidden
              draggable={false}
              decoding="async"
              loading={i === START ? "eager" : "lazy"}
              fetchPriority={i === START ? "high" : "low"}
              className="h-full w-full object-cover object-center will-change-transform"
            />
          </div>
        ))}
      </div>

      <div data-veil className="pointer-events-none absolute inset-0 z-[2] bg-black opacity-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3] opacity-[0.07] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-1/3 bg-gradient-to-t from-black/25 to-transparent" />

      <Navbar />

      {/* Título + metadados (um par por slide, empilhados na mesma célula) */}
      <section className="absolute inset-x-0 bottom-[calc(50%+20px)] z-10 px-4 md:px-[18px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="grid">
            {SLIDES.map((s) => (
              <h2
                key={s.id}
                data-title
                className="col-start-1 row-start-1 font-display text-[56px] font-medium leading-[0.88] tracking-[-0.045em] sm:text-[72px] lg:text-[84px]"
              >
                {s.title.map((line) => (
                  <span key={line} data-title-line className="block">
                    {line}
                  </span>
                ))}
              </h2>
            ))}
          </div>

          <div className="grid flex-1 font-mono text-[10px] uppercase leading-none tracking-wide md:mb-[3px] md:text-[11px]">
            {SLIDES.map((s) => (
              <div
                key={s.id}
                data-meta
                className="col-start-1 row-start-1 flex flex-wrap items-end justify-between gap-x-6 gap-y-1 md:flex-nowrap md:pl-[70px]"
              >
                <span data-meta-item className="block">{s.by}</span>
                <div className="flex gap-6 md:gap-[90px]">
                  <span data-meta-item className="block">{s.date}</span>
                  <span data-meta-item className="block">{s.time}</span>
                  <span data-meta-item className="block">{s.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria horizontal: posicionada por JS (loop contínuo, sem DOM duplicado) */}
      <div
        data-strip
        role="group"
        aria-roledescription="carousel"
        aria-label="Galeria Harbor Echoes"
        className="absolute inset-x-0 top-1/2 z-10 h-[calc(var(--w)*1.35)] cursor-grab touch-pan-y active:cursor-grabbing [--w:40vw] sm:[--w:28vw] md:[--w:21vw] lg:[--w:15.2vw]"
      >
        {SLIDES.map((s) => (
          <button
            key={s.id}
            type="button"
            data-card
            tabIndex={-1}
            aria-label={`${pad(s.id)}. ${s.title.join(" ")}`}
            className="absolute left-0 top-0 aspect-[180/243] w-[var(--w)] overflow-hidden opacity-0 will-change-transform"
          >
            <img
              data-card-img
              src={s.thumb}
              alt={s.alt}
              draggable={false}
              decoding="async"
              loading="lazy"
              className="h-full w-full origin-top object-cover"
            />
          </button>
        ))}
      </div>

      {/* Paginação */}
      <div
        data-pagination
        className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-[15px] pb-[15px]"
      >
        <div className="w-[min(254px,calc(100%-110px))] font-mono text-[10px] leading-none tracking-wide">
          <div className="mb-2 flex justify-between">
            <span className="inline-block overflow-hidden">
              <span data-count className="inline-block">{pad(START + 1)}</span>
            </span>
            <span>{pad(total)}</span>
          </div>
          <div className="relative h-px w-full bg-white/35">
            <div data-progress className="absolute -top-px left-0 h-[3px] w-[14%] bg-white" />
          </div>
        </div>

        <div className="flex gap-1.5">
          <button type="button" aria-label="Slide anterior" onClick={() => motion.current?.prev()} className={ctrl}>←</button>
          <button type="button" aria-label="Próximo slide" onClick={() => motion.current?.next()} className={ctrl}>→</button>
        </div>
      </div>

      {/* Anúncio para leitores de tela */}
      <p data-live aria-live="polite" className="sr-only" />

      {/* Cursor contextual (só desktop com mouse) */}
      <div
        data-cursor
        aria-hidden
        className="pointer-events-none invisible fixed left-0 top-0 z-[70] hidden rounded-full bg-white px-3 py-2 font-mono text-[10px] uppercase leading-none tracking-wide text-black opacity-0 [@media(hover:hover)_and_(pointer:fine)]:block"
      >
        <span data-cursor-label>Drag</span>
      </div>
    </main>
  );
}