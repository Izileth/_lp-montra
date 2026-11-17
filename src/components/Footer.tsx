import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BRAND, FOOTER_COLUMNS, SOCIALS } from "../data/site";

gsap.registerPlugin(ScrollTrigger);

function useLocalTime(timeZone: string) {
  const fmt = () =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());

  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setTime(fmt()), 15_000);
    return () => window.clearInterval(id);
  }, [timeZone]);
  return time;
}

const label = "mb-4 font-mono text-[11px] uppercase leading-none tracking-wide opacity-60";
const item = "font-mono text-[12px] uppercase leading-[1.7] tracking-wide";

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const time = useLocalTime(BRAND.timeZone);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".js-foot", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.from(".js-wordmark", {
        yPercent: 100,
        duration: 1.4,
        ease: "power4.out",
        scrollTrigger: { trigger: ".js-wordmark-wrap", start: "top 95%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    const valid = /^\S+@\S+\.\S+$/.test(email);
    setStatus(valid ? "ok" : "error");
    if (valid) e.currentTarget.reset();
    // 👉 envie `email` para sua API / serviço de newsletter aqui
  };

  return (
    <footer ref={root} id="contact" className="relative overflow-hidden bg-[#9a2220] text-white">
      <div className="mx-auto max-w-[1400px] px-4 pt-16 md:px-[18px] md:pt-24">
        {/* topo: tagline + newsletter */}
        <div className="grid gap-12 md:grid-cols-12 md:gap-6">
          <div className="js-foot md:col-span-7">
            <h2 className="font-display text-[40px] font-medium leading-[0.92] tracking-[-0.045em] sm:text-[56px] lg:text-[72px]">
              {BRAND.tagline}
            </h2>
            <p className="mt-6 max-w-[46ch] font-mono text-[12px] leading-[1.7] tracking-wide opacity-80">
              {BRAND.description}
            </p>
          </div>

          <form onSubmit={onSubmit} className="js-foot md:col-span-4 md:col-start-9" noValidate>
            <p className={label}>Newsletter</p>
            <div className="flex items-center gap-1.5 rounded-full bg-black/15 p-1 backdrop-blur-sm">
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="YOUR EMAIL"
                aria-label="Email"
                className="min-w-0 flex-1 bg-transparent px-4 font-mono text-[11px] uppercase tracking-wide placeholder:text-white/50 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-white px-4 py-2.5 font-mono text-[11px] uppercase leading-none tracking-wide text-black transition hover:bg-white/80"
              >
                Subscribe →
              </button>
            </div>
            <p role="status" className="mt-3 h-4 font-mono text-[10px] uppercase tracking-wide opacity-80">
              {status === "ok" && "Thanks — you're on the list."}
              {status === "error" && "Please enter a valid email."}
            </p>
          </form>
        </div>

        {/* colunas */}
        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-white/20 pt-10 md:grid-cols-12 md:gap-y-0">
          <div className="js-foot md:col-span-3">
            <p className={label}>Visit</p>
            <address className={`${item} not-italic`}>
              {BRAND.address.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </address>
            <ul className={`${item} mt-4`}>
              {BRAND.hours.map((h) => (
                <li key={h.day} className="flex gap-3">
                  <span className="opacity-60">{h.day}</span>
                  <span>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="js-foot md:col-span-2">
              <p className={label}>{col.title}</p>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className={`${item} underline-offset-4 transition hover:underline`}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="js-foot col-span-2 md:col-span-1">
            <p className={label}>Follow</p>
            <ul>
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`${item} underline-offset-4 transition hover:underline`}
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* contato rápido */}
        <div className="js-foot mt-12 flex flex-col gap-1 border-t border-white/20 pt-6 font-mono text-[12px] uppercase tracking-wide sm:flex-row sm:justify-between">
          <a href={`mailto:${BRAND.email}`} className="underline-offset-4 hover:underline">
            {BRAND.email}
          </a>
          <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="underline-offset-4 hover:underline">
            {BRAND.phone}
          </a>
        </div>
      </div>

      {/* wordmark gigante */}
      <div className="js-wordmark-wrap mt-10 overflow-hidden px-2 md:mt-14">
        <h2
          aria-hidden
          className="js-wordmark select-none pt-[0.05em] text-center font-logo text-[30vw] uppercase leading-[0.82] tracking-[-0.02em] text-black/90"
        >
          {BRAND.name}
        </h2>
      </div>

      {/* barra inferior */}
      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 pb-5 pt-4 font-mono text-[10px] uppercase leading-none tracking-wide md:px-[18px]">
        <span>© {BRAND.year} {BRAND.name}</span>
        <span>
          {BRAND.city} · {time}
        </span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="rounded-full bg-black/15 px-3 py-[7px] backdrop-blur-sm transition hover:bg-black/30"
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}