import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { SLIDES } from "../data/slides";
import { createCarouselMotion, type CarouselMotion } from "../motion/carousel";
import ProgressiveBlur from "./ProgressiveBlur";
const START = 0; // Começa no primeiro espécime (Sequóia-Gigante)
const pad = (n: number) => String(n).padStart(2, "0");

// grão de filme bem discreto (SVG inline, sem requisição extra)
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const ctrl =
  "flex h-7 w-7 items-center justify-center rounded-full bg-[#051F20]/60 border border-[#8EB69B]/30 font-mono text-[12px] leading-none text-[#DAF1DE] backdrop-blur-md transition hover:bg-[#163832] hover:border-[#8EB69B]/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8EB69B]";

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
      className="relative h-[100svh] min-h-[560px] w-full select-none overflow-hidden overscroll-x-none bg-[#051F20] text-[#DAF1DE]"
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

      <div data-veil className="pointer-events-none absolute inset-0 z-[2] bg-[#051F20] opacity-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3] opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      {/* Gradiente superior sutil para proteger a navegação */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-36 bg-gradient-to-b from-[#051F20]/80 via-[#051F20]/30 to-transparent" />
      {/* Gradiente inferior e intermediário para contraste de títulos, metadados e carrossel */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[65%] bg-gradient-to-t from-[#051F20]/95 via-[#051F20]/50 to-transparent" />


      {/* Título + metadados (um par por slide, empilhados na mesma célula) */}
      <section className="absolute inset-x-0 bottom-[calc(50%+20px)] z-10 px-4 md:px-[18px]">

        <ProgressiveBlur className="inset-x-0 -top-24 bottom-[-20px] md:-top-32" />
              <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="grid">
            {SLIDES.map((s) => (
              <h2
                key={s.id}
                data-title
                className="col-start-1 row-start-1 font-display text-[56px] font-medium leading-[0.88] tracking-[-0.045em] text-[#DAF1DE] sm:text-[72px] lg:text-[84px]"
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
                className="col-start-1 row-start-1 flex flex-wrap items-end justify-between gap-x-6 gap-y-1 text-[#8EB69B] md:flex-nowrap md:pl-[70px]"
              >
                <span data-meta-item className="block font-medium text-[#DAF1DE]">{s.by}</span>
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
        aria-label="Catálogo Botânico de Espécies Arbóreas"
        className="absolute inset-x-0 top-1/2 z-10 h-[calc(var(--w)*1.35)] cursor-grab touch-pan-y active:cursor-grabbing [--w:40vw] sm:[--w:28vw] md:[--w:21vw] lg:[--w:15.2vw]"
      >
        {SLIDES.map((s) => (
          <button
            key={s.id}
            type="button"
            data-card
            tabIndex={-1}
            aria-label={`${pad(s.id)}. ${s.title.join(" ")} (${s.by})`}
            className="group absolute left-0 top-0 aspect-[180/243] w-[var(--w)] overflow-hidden rounded-[3px] border border-[#8EB69B]/25 opacity-0 shadow-lg shadow-black/40 will-change-transform"
          >
            <img
              data-card-img
              src={s.thumb}
              alt={s.alt}
              draggable={false}
              decoding="async"
              loading="lazy"
              className="h-full w-full origin-top object-cover transition-filter duration-300"
            />
          </button>
        ))}
      </div>

      {/* Paginação */}
      <div
        data-pagination
        className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-[15px] pb-[15px] text-[#DAF1DE]"
      >
        <div className="w-[min(254px,calc(100%-110px))] font-mono text-[10px] leading-none tracking-wide">
          <div className="mb-2 flex justify-between">
            <span className="inline-block overflow-hidden">
              <span data-count className="inline-block font-semibold text-[#DAF1DE]">{pad(START + 1)}</span>
            </span>
            <span className="text-[#8EB69B]">{pad(total)}</span>
          </div>
          <div className="relative h-px w-full bg-[#8EB69B]/30">
            <div data-progress className="absolute -top-px left-0 h-[3px] w-[14%] bg-[#DAF1DE]" />
          </div>
        </div>

        <div className="flex gap-1.5">
          <button type="button" aria-label="Espécime anterior" onClick={() => motion.current?.prev()} className={ctrl}>←</button>
          <button type="button" aria-label="Próximo espécime" onClick={() => motion.current?.next()} className={ctrl}>→</button>
        </div>
      </div>

      {/* Anúncio para leitores de tela */}
      <p data-live aria-live="polite" className="sr-only" />

      {/* Cursor contextual (só desktop com mouse) */}
      <div
        data-cursor
        aria-hidden
        className="pointer-events-none invisible fixed left-0 top-0 z-[70] hidden rounded-full bg-[#DAF1DE] px-3 py-2 font-mono text-[10px] uppercase leading-none tracking-wide text-[#051F20] shadow-md opacity-0 [@media(hover:hover)_and_(pointer:fine)]:block"
      >
        <span data-cursor-label>Arrastar</span>
      </div>
    </main>
  );
}
