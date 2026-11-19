import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { BRAND, NAV_LINKS, SOCIALS } from "../data/site";
import { navigate } from "../router";

const pill =
  "flex items-center gap-1.5 rounded-full bg-[#051F20]/50 border border-[#8EB69B]/30 px-3 py-[7px] font-mono text-[11px] uppercase leading-none tracking-wide text-[#DAF1DE] backdrop-blur-md transition hover:bg-[#163832]/80 hover:border-[#8EB69B]/60";

const inline =
  "group relative font-mono text-[11px] uppercase leading-none tracking-wide text-[#DAF1DE]/80 transition hover:text-[#DAF1DE]";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const left = NAV_LINKS.slice(0, 3);
  const right = NAV_LINKS.slice(3);

  /* timeline do menu (criada uma vez) */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(overlay.current, {
        clipPath: "inset(0% 0% 100% 0%)",
        visibility: "hidden",
      });

      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "power3.inOut" } })
        .set(overlay.current, { visibility: "visible" })
        .to(overlay.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8 })
        .from(
          ".js-menu-link",
          { yPercent: 110, duration: 0.9, stagger: 0.06, ease: "power4.out" },
          0.35
        )
        .from(
          ".js-menu-meta",
          { opacity: 0, y: 12, duration: 0.6, stagger: 0.05, ease: "power3.out" },
          0.6
        );

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        tl.current.timeScale(30);
      }
    }, overlay);

    return () => ctx.revert();
  }, []);

  /* abre / fecha */
  useEffect(() => {
    if (open) tl.current?.play();
    else tl.current?.reverse();
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  /* ESC fecha */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleBack = () => {
    if (window.location.pathname !== "/" && window.history.length <= 1) {
      navigate("/");
    } else {
      window.history.back();
    }
  };

  return (
    <>
      <header className="js-header fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-4 pt-[18px] text-[#DAF1DE] md:justify-center md:gap-[86px] xl:grid xl:grid-cols-[1fr_auto_1fr] xl:gap-0 xl:px-[18px]">
        {/* esquerda */}
        <div className="flex items-center gap-8 xl:justify-start">
          <button type="button" className={pill} onClick={handleBack}>
            <span aria-hidden>↖</span> Voltar
          </button>
          <nav className="hidden items-center gap-7 xl:flex" aria-label="Primary">
            {left.map((l) => (
              <a key={l.label} href={l.href} className={inline}>
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#8EB69B] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
        </div>

        {/* logo */}
        <a
          href="/"
          aria-label={BRAND.name}
          className="font-logo text-[20px] uppercase leading-none tracking-tight text-[#DAF1DE] transition-opacity hover:opacity-90"
        >
          {BRAND.name}
        </a>

        {/* direita */}
        <div className="flex items-center gap-8 xl:justify-end">
          <nav className="hidden items-center gap-7 xl:flex" aria-label="Secondary">
            {right.map((l) => (
              <a key={l.label} href={l.href} className={inline}>
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#8EB69B] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
          <button
            type="button"
            className={pill}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Fechar" : "Menu"} <span aria-hidden>{open ? "✕" : "≡"}</span>
          </button>
        </div>
      </header>

      {/* Menu em tela cheia */}
      <div
        id="site-menu"
        ref={overlay}
        aria-hidden={!open}
        className="fixed inset-0 z-50 overflow-y-auto bg-[#051F20] text-[#DAF1DE]"
      >
        <div className="mx-auto flex min-h-full max-w-[1400px] flex-col justify-between gap-10 px-4 pb-6 pt-24 md:grid md:grid-cols-12 md:gap-6 md:px-[18px] md:pt-28">
          {/* links grandes */}
          <nav className="md:col-span-8" aria-label="Menu">
            <ul className="flex flex-col">
              {NAV_LINKS.map((l, i) => (
                <li key={l.label} className="overflow-hidden border-b border-[#8EB69B]/20">
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="js-menu-link group flex items-baseline gap-4 py-2 md:py-3"
                  >
                    <span className="font-mono text-[11px] text-[#8EB69B] opacity-80">{pad(i + 1)}</span>
                    <span className="font-display text-[44px] font-medium leading-[0.95] tracking-[-0.045em] text-[#DAF1DE] transition-transform duration-300 group-hover:translate-x-3 group-hover:text-[#8EB69B] sm:text-[64px] lg:text-[84px]">
                      {l.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* informações */}
          <aside className="grid grid-cols-2 gap-6 font-mono text-[11px] uppercase leading-[1.6] tracking-wide md:col-span-4 md:flex md:flex-col md:justify-end md:gap-8">
            <div className="js-menu-meta">
              <p className="mb-2 text-[#8EB69B] opacity-80">Espécime em Destaque</p>
              <p className="font-medium text-[#DAF1DE]">Sequóia-Gigante</p>
              <p className="text-[#DAF1DE]/80">Sierra Nevada · +3.000 anos</p>
              <p className="text-[#DAF1DE]/80">{BRAND.city}</p>
            </div>
            <div className="js-menu-meta">
              <p className="mb-2 text-[#8EB69B] opacity-80">Herbário Central</p>
              <p className="text-[#DAF1DE]">{BRAND.email}</p>
              <p className="text-[#DAF1DE]">{BRAND.phone}</p>
            </div>
            <div className="js-menu-meta col-span-2 md:col-span-1">
              <p className="mb-2 text-[#8EB69B] opacity-80">Redes & Acervos</p>
              <ul className="flex flex-wrap gap-x-5 gap-y-1">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#DAF1DE] underline-offset-4 transition hover:text-[#8EB69B] hover:underline"
                    >
                      {s.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
