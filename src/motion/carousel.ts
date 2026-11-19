import { gsap, Draggable, InertiaPlugin, Observer, SplitText, EASE } from "./gsap";
import type { Slide } from "../data/slides";

type Options = { root: HTMLElement; slides: Slide[]; start: number };

export type CarouselMotion = {
  next(): void;
  prev(): void;
  goTo(index: number): void;
  destroy(): void;
};

const GAP = 2;
const BASE_SCALE = 1.04;
const SEGMENT = 14; // % da linha de progresso
// altura visível do card inativo / altura total do card ativo
const R0 = 122 / 182 / (243 / 180);
const pad = (n: number) => String(n).padStart(2, "0");

export function createCarouselMotion({ root, slides, start }: Options): CarouselMotion {
  const n = slides.length;
  const half = n / 2;
  const mod = (v: number) => ((v % n) + n) % n;
  const shortest = (v: number) => mod(v + half) - half; // menor caminho no loop

  const mq = (q: string) => window.matchMedia(q).matches;
  const reduce = mq("(prefers-reduced-motion: reduce)");
  const fine = mq("(hover: hover) and (pointer: fine)");
  const lite = mq("(max-width: 767px)");
  const speed = reduce ? 60 : 1;

  /* Tudo que o motor cria vive neste contexto: um revert() limpa tudo (Strict Mode safe). */
  const ctx = gsap.context(() => {}, root);
  const run = (fn: () => void) => ctx.add(fn);

  /* ------------------------------ DOM ------------------------------ */
  const all = <T extends HTMLElement>(sel: string, scope: ParentNode = root) =>
    gsap.utils.toArray<T>(sel, scope);
  const one = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!;

  const bgStack = one("[data-bg-stack]");
  const bgs = all("[data-bg]");
  const bgImgs = all<HTMLImageElement>("[data-bg-img]");
  const veil = one("[data-veil]");
  const blurEl = one("[data-blur]");
  const titles = all("[data-title]");
  const metas = all("[data-meta]");
  const strip = one("[data-strip]");
  const cards = all("[data-card]");
  const cardImgs = all<HTMLImageElement>("[data-card-img]");
  const count = one("[data-count]");
  const progress = one("[data-progress]");
  const pagination = one("[data-pagination]");
  const live = one("[data-live]");
  const cursor = root.querySelector<HTMLElement>("[data-cursor]");
  const cursorLabel = root.querySelector<HTMLElement>("[data-cursor-label]");
  const nav = all(".js-header > *");

  /* ------------------------------ estado ------------------------------ */
  const S = { pos: start, emph: 0 }; // pos: posição contínua em "cards"; emph: ênfase do card ativo (0–1)
  const T = { x: 0 };                // proxy em px para a inércia
  const tick = {};                   // alvo "relógio" para chamar render durante a intro
  const enter = cards.map(() => ({ v: 0 })); // progresso de entrada de cada card

  let committed = start; // posição inteira (sem wrap) que o conteúdo já reflete
  let shown = start;     // índice (com wrap) exibido
  let z = 1;
  let W = 0, stepPx = 0, cx = 0;
  let pressed = false, dragged = false, introDone = false, destroyed = false;
  let lastInput = 0, lastWheel = 0;
  let tl: gsap.core.Timeline | null = null;
  let splits: SplitText[] = [];

  /* ------------------------------ galeria: layout contínuo ------------------------------ */
  const measure = () => {
    W = cards[0].offsetWidth;
    stepPx = W + GAP;
    cx = strip.clientWidth / 2;
    render();
  };

  /** Posiciona todos os cards a partir de S.pos. Só transform, opacity e clip-path. */
  const render = () => {
    for (let i = 0; i < n; i++) {
      const d = shortest(i - S.pos);
      const ad = Math.abs(d);
      const f = S.emph * Math.max(0, 1 - ad);
      const e = f * f * (3 - 2 * f); // smoothstep: 0 = inativo, 1 = protagonista
      const vis = R0 + (1 - R0) * e;
      const x = cx + d * stepPx - W / 2;
      const p = enter[i].v;
      const y = (1 - p) * (48 + ad * 22);

      const card = cards[i];
      card.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      card.style.opacity = (p * (0.8 + 0.2 * e)).toFixed(3);
      card.style.clipPath = `inset(0 0 ${((1 - vis) * 100).toFixed(3)}% 0 round 3px)`;
      card.style.zIndex = String(50 - Math.round(ad * 4));
      cardImgs[i].style.transform = `scale(${(1.1 - 0.1 * e).toFixed(4)})`;
    }
  };

  /* ------------------------------ títulos (SplitText) ------------------------------ */
  const splitTitles = () => {
    splits = titles.map((t) => {
      const s = SplitText.create(all("[data-title-line]", t), {
        type: "lines",
        mask: "lines",
        linesClass: "title-line",
      });
      const masks = (s as unknown as { masks?: HTMLElement[] }).masks;
      // folga na máscara para não cortar as letras (entrelinha apertada)
      if (masks?.length) gsap.set(masks, { padding: "0.09em 0", margin: "-0.09em 0" });
      return s;
    });
  };

  /* ------------------------------ transição de slide ------------------------------ */
  const settle = () => {
    bgs.forEach((b, i) => {
      if (i !== shown) gsap.set(b, { autoAlpha: 0 });
    });
    gsap.set(veil, { opacity: 0 });
  };

  const show = (next: number, dir: number) =>
    run(() => {
      const prev = shown;
      shown = next;
      tl?.kill(); // interrompe a transição anterior (sem race condition)

      const inc = bgs[next];
      const incImg = bgImgs[next];
      const outImg = bgImgs[prev];

      // fundo: camada que chega vai por cima, mascarada
      gsap.killTweensOf([inc, incImg, outImg]);
      gsap.set(inc, {
        autoAlpha: 1,
        zIndex: ++z,
        clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
      });
      gsap.set(incImg, { scale: lite ? 1.12 : 1.22, xPercent: dir * 6 });

      // limpa títulos/metas que ficaram no meio de uma transição interrompida
      titles.forEach((t, i) => i !== prev && i !== next && gsap.set(t, { autoAlpha: 0 }));
      metas.forEach((m, i) => i !== prev && i !== next && gsap.set(m, { autoAlpha: 0 }));

      const so = splits[prev].lines;
      const si = splits[next].lines;
      const mo = all("[data-meta-item]", metas[prev]);
      const mi = all("[data-meta-item]", metas[next]);

      gsap.set(titles[next], { autoAlpha: 1 });
      gsap.set(si, { yPercent: 118 });
      gsap.set(metas[next], { autoAlpha: 1 });
      gsap.set(mi, { x: dir * 22, autoAlpha: 0 });

      const t = (tl = gsap.timeline({ defaults: { ease: EASE.out }, onComplete: settle }));
      t.timeScale(speed);

      t
        // 1. fundo: máscara + zoom assentando; saída com leve deslocamento oposto
        .to(inc, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, ease: EASE.reveal }, 0)
        .to(incImg, { scale: 1, xPercent: 0, duration: 1.7, ease: EASE.settle }, 0)
        .to(outImg, { scale: 1.07, xPercent: -dir * 5, duration: 1.3, ease: EASE.settle }, 0)
        // pulso da faixa: alivia quando a foto nova abre e volta a assentar
        .to(blurEl, { "--k": lite ? 1 : 0.55, duration: 0.45, ease: "sine.out" } as gsap.TweenVars, 0)
        .to(blurEl, { "--k": 1, duration: 0.95, ease: "sine.inOut" } as gsap.TweenVars, 0.45)
        .to(veil, { opacity: lite ? 0 : 0.26, duration: 0.45, ease: "sine.out" }, 0)
        .to(veil, { opacity: 0, duration: 0.9, ease: "sine.inOut" }, 0.45)
        .to(root, { backgroundColor: slides[next].tone, duration: 1.2, ease: "sine.inOut" }, 0)

        // 2. título: sai por cima, entra por baixo, dentro da máscara
        .to(so, { yPercent: -118, duration: 0.7, stagger: 0.05, ease: EASE.in }, 0)
        .set(titles[prev], { autoAlpha: 0 }, 0.8)
        .to(si, { yPercent: 0, duration: 1.05, stagger: 0.08 }, 0.38)

        // 3. metadados: deslocamento horizontal na direção da navegação
        .to(mo, { x: -dir * 22, autoAlpha: 0, duration: 0.45, stagger: 0.04, ease: EASE.in }, 0)
        .set(metas[prev], { autoAlpha: 0 }, 0.55)
        .to(mi, { x: 0, autoAlpha: 1, duration: 0.8, stagger: 0.06 }, 0.55)

        // 4. paginação: número rola, segmento desliza
        .to(count, { yPercent: -dir * 100, opacity: 0, duration: 0.28, ease: EASE.in }, 0)
        .add(() => {
          count.textContent = pad(next + 1);
          gsap.set(count, { yPercent: dir * 100 });
        }, 0.28)
        .to(count, { yPercent: 0, opacity: 1, duration: 0.5 }, 0.3)
        .to(progress, { xPercent: (next / (n - 1)) * ((100 - SEGMENT) / SEGMENT) * 100, duration: 0.95, ease: EASE.glide }, 0);

      live.textContent = `${pad(next + 1)} / ${pad(n)}: ${slides[next].title.join(" ")}`;
      cards.forEach((c, i) => (i === next ? c.setAttribute("aria-current", "true") : c.removeAttribute("aria-current")));
    });

  /* ------------------------------ navegação ------------------------------ */
  const commit = (t: number) => {
    if (t === committed) return;
    const dir = t > committed ? 1 : -1;
    committed = t;
    const idx = mod(t);
    if (idx !== shown) show(idx, dir);
  };

  const moveTo = (t: number) => {
    commit(t);
    const dist = Math.abs(t - S.pos);
    gsap.killTweensOf(S);
    run(() => {
      gsap.to(S, {
        pos: t,
        duration: reduce ? 0 : 0.8 + Math.min(dist, 4) * 0.13,
        ease: EASE.glide,
        onUpdate: render,
      });
    });
  };

  const gate = () => {
    const now = performance.now();
    if (now - lastInput < 320) return false;
    lastInput = now;
    return true;
  };

  const stepBy = (dir: number) => {
    if (!introDone || pressed || !gate()) return;
    moveTo(committed + dir);
  };

  const goTo = (i: number) => {
    if (!introDone || pressed) return;
    const diff = Math.round(shortest(i - committed));
    if (!diff || !gate()) return;
    moveTo(committed + diff);
  };

  /* ------------------------------ drag + inércia ------------------------------ */
  const proxy = document.createElement("div");
  let pressPos = 0;
  const cursorScale = (s: number) => cursor && gsap.to(cursor, { scale: s, duration: 0.2, ease: "power2.out", overwrite: "auto" });

  const onStripClick = (e: Event) => {
    if (dragged) return;
    const c = (e.target as HTMLElement).closest<HTMLElement>("[data-card]");
    if (c) goTo(cards.indexOf(c));
  };

  const [drag] = Draggable.create(proxy, {
    trigger: strip,
    type: "x",
    minimumMovement: 4,
    allowContextMenu: true,
    onPress: () => {
      if (!introDone) return;
      pressed = true;
      dragged = false;
      gsap.killTweensOf([S, T]);
      gsap.set(proxy, { x: 0 });
      drag.update();
      pressPos = S.pos;
      InertiaPlugin.track(proxy, "x");
      cursorScale(0.86);
    },
    onDragStart: () => {
      dragged = true;
    },
    onDrag: () => {
      if (!introDone) return;
      S.pos = pressPos - drag.x / stepPx;
      render();
    },
    onRelease: () => {
      if (!pressed) return;
      pressed = false;
      cursorScale(1);

      const vPx = InertiaPlugin.getVelocity(proxy, "x") || 0;
      InertiaPlugin.untrack(proxy, "x");

      const base = committed;
      const lo = base - 3;
      const hi = base + 3;

      // quase parado: encaixa suavemente no card mais próximo
      if (Math.abs(vPx) < 120 || reduce) {
        moveTo(gsap.utils.clamp(lo, hi, Math.round(S.pos)));
        return;
      }

      // lançado: inércia real, com pouso sempre em um card inteiro
      T.x = S.pos * stepPx;
      run(() => {
        gsap.to(T, {
          inertia: {
            x: {
              velocity: -vPx,
              end: (natural: number) => {
                const t = gsap.utils.clamp(lo, hi, Math.round(natural / stepPx));
                commit(t); // o conteúdo já troca para o destino final
                return t * stepPx;
              },
            },
            duration: { min: 0.5, max: 1.6 },
          },
          onUpdate: () => {
            S.pos = T.x / stepPx;
            render();
          },
        } as gsap.TweenVars);
      });
    },
    onClick: (e: Event) => onStripClick(e),
  });

  /* ------------------------------ entradas: teclado, wheel, swipe ------------------------------ */
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const t = e.target as HTMLElement | null;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    if (document.getElementById("site-menu")?.getAttribute("aria-hidden") === "false") return;
    const r = root.getBoundingClientRect();
    if (r.bottom < innerHeight * 0.4 || r.top > innerHeight * 0.6) return;
    stepBy(e.key === "ArrowRight" ? 1 : -1);
  };

  // um passo por gesto de trackpad (ignora a cauda de inércia do próprio trackpad)
  const wheelStep = (dir: number) => {
    const now = performance.now();
    const quiet = now - lastWheel > 180;
    lastWheel = now;
    if (quiet) stepBy(dir);
  };

  const observers: Observer[] = [];
  run(() => {
    observers.push(
      Observer.create({
        target: root,
        type: "wheel",
        wheelSpeed: -1,
        lockAxis: true,
        tolerance: 30,
        preventDefault: false,
        onLeft: () => wheelStep(1),
        onRight: () => wheelStep(-1),
      }),
      // swipe fora da galeria (a galeria tem o próprio Draggable)
      Observer.create({
        target: root,
        type: "touch,pointer",
        lockAxis: true,
        tolerance: 50,
        dragMinimum: 12,
        preventDefault: false,
        ignore: "[data-strip], [data-pagination], .js-header, a, button, input",
        onLeft: () => stepBy(1),
        onRight: () => stepBy(-1),
      })
    );
  });

  /* ------------------------------ cursor contextual + parallax (desktop) ------------------------------ */
  const cleanups: Array<() => void> = [];
  if (fine) {
    run(() => {
      if (cursor && cursorLabel) {
        gsap.set(cursor, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.6 });
        const qx = gsap.quickTo(cursor, "x", { duration: 0.45, ease: "power3.out" });
        const qy = gsap.quickTo(cursor, "y", { duration: 0.45, ease: "power3.out" });

        const onEnter = (e: PointerEvent) => {
          gsap.set(cursor, { x: e.clientX, y: e.clientY + 34 });
          gsap.to(cursor, { autoAlpha: 1, scale: 1, duration: 0.35, ease: EASE.out, overwrite: "auto" });
        };
        const onMove = (e: PointerEvent) => {
          qx(e.clientX);
          qy(e.clientY + 34);
          const c = (e.target as HTMLElement).closest<HTMLElement>("[data-card]");
          const label = c && cards.indexOf(c) !== shown ? "Select" : "Drag";
          if (cursorLabel.textContent !== label) cursorLabel.textContent = label;
        };
        const onLeave = () =>
          gsap.to(cursor, { autoAlpha: 0, scale: 0.6, duration: 0.3, ease: "power2.out", overwrite: "auto" });

        strip.addEventListener("pointerenter", onEnter);
        strip.addEventListener("pointermove", onMove);
        strip.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          strip.removeEventListener("pointerenter", onEnter);
          strip.removeEventListener("pointermove", onMove);
          strip.removeEventListener("pointerleave", onLeave);
        });
      }

      // parallax sutil do fundo
      const px = gsap.quickTo(bgStack, "x", { duration: 1.2, ease: "power3.out" });
      const py = gsap.quickTo(bgStack, "y", { duration: 1.2, ease: "power3.out" });
      const onParallax = (e: PointerEvent) => {
        px(-(e.clientX / innerWidth - 0.5) * 16);
        py(-(e.clientY / innerHeight - 0.5) * 10);
      };
      root.addEventListener("pointermove", onParallax);
      cleanups.push(() => root.removeEventListener("pointermove", onParallax));
    });
  }

  /* ------------------------------ intro cinematográfica ------------------------------ */
  const playIntro = () =>
    run(() => {
      splitTitles();

      const lines0 = splits[start].lines;
      const items0 = all("[data-meta-item]", metas[start]);
      const dist = (i: number) => Math.abs(shortest(i - start));

      // estados iniciais
      gsap.set(bgs[start], { autoAlpha: 1, zIndex: z, clipPath: "inset(50% 0% 50% 0%)" });
      gsap.set(bgImgs[start], { scale: lite ? 1.14 : 1.32 });
      gsap.set(bgStack, { scale: 1.12, autoAlpha: 0 });
      gsap.set(titles[start], { autoAlpha: 1 });
      gsap.set(lines0, { yPercent: 118 });
      gsap.set(metas[start], { autoAlpha: 1 });
      gsap.set(items0, { y: 18, autoAlpha: 0 });
      gsap.set(nav, { y: -18, autoAlpha: 0 });
      gsap.set(pagination, { y: 18, autoAlpha: 0 });
      gsap.set(progress, { xPercent: (start / (n - 1)) * ((100 - SEGMENT) / SEGMENT) * 100 });

      const intro = gsap.timeline({
        defaults: { ease: EASE.out },
        onComplete: () => {
          introDone = true;
          render();
          // aquece o decode das demais fotos fora do caminho crítico
          const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
          (idle ?? ((cb: () => void) => setTimeout(cb, 400)))(() =>
            bgImgs.forEach((img) => img.decode?.().catch(() => {}))
          );
        },
      });
      intro.timeScale(speed);

      intro
        // 1. o fundo emerge
        .fromTo(root, { backgroundColor: "#051F20" }, { backgroundColor: slides[start].tone, duration: 1.6, ease: "sine.inOut" }, 0)
        .to(bgStack, { autoAlpha: 1, scale: BASE_SCALE, duration: 1.8, ease: EASE.settle }, 0)
        // 2. a foto principal se revela por máscara
        .to(bgs[start], { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: EASE.reveal }, 0.25)
        .to(bgImgs[start], { scale: 1, duration: 2.2, ease: EASE.settle }, 0.25)
        // 3. título (SplitText por linhas)
        .to(lines0, { yPercent: 0, duration: 1.15, stagger: 0.12 }, 0.85)
        // 3b. a faixa de leitura "foca" enquanto o título entra
        .to(blurEl, { "--k": 1, duration: 1.7, ease: EASE.settle } as gsap.TweenVars, 0.8)
        // 4. metadados
        .to(items0, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.07 }, 1.15);  

      // 5. galeria: cards entram em sequência, do centro para as bordas
      enter.forEach((e, i) => intro.to(e, { v: 1, duration: 1.15 }, 0.95 + dist(i) * 0.1));
      intro.to(tick, { duration: 3.4, onUpdate: render }, 0.95);

      intro
        // 6. o card ativo assume sua posição de destaque
        .to(S, { emph: 1, duration: 1.3, ease: EASE.glide }, 1.8)
        // 7. navegação e paginação por último
        .to(nav, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08 }, 2.3)
        .to(pagination, { y: 0, autoAlpha: 1, duration: 0.9 }, 2.45);
    });

  /* ------------------------------ boot ------------------------------ */
  run(() => {
    // tudo escondido antes do primeiro paint (a intro revela na ordem certa)
    gsap.set(bgs, { autoAlpha: 0 });
    gsap.set(titles, { autoAlpha: 0 });
    gsap.set(metas, { autoAlpha: 0 });
    gsap.set(nav, { autoAlpha: 0 });
    gsap.set(pagination, { autoAlpha: 0 });
        gsap.set(blurEl, { "--k": 0 } as gsap.TweenVars);
    gsap.set(veil, { opacity: 0 });
    cards[start].setAttribute("aria-current", "true");
    measure();
  });

  const ro = new ResizeObserver(measure);
  ro.observe(strip);
  window.addEventListener("keydown", onKey);
  strip.addEventListener("click", onStripClick);

  // espera fonte + 1ª imagem (com teto de 2,5 s) para medir o SplitText corretamente
  const firstImg = bgImgs[start].decode?.().catch(() => {}) ?? Promise.resolve();
  Promise.race([
    Promise.all([document.fonts?.ready ?? Promise.resolve(), firstImg]),
    new Promise((r) => setTimeout(r, 2500)),
  ]).then(() => {
    if (!destroyed) playIntro();
  });

  /* ------------------------------ API ------------------------------ */
  return {
    next: () => stepBy(1),
    prev: () => stepBy(-1),
    goTo,
    destroy: () => {
      destroyed = true;
      ro.disconnect();
      window.removeEventListener("keydown", onKey);
      strip.removeEventListener("click", onStripClick);
      cleanups.forEach((fn) => fn());
      observers.forEach((o) => o.kill());
      drag.kill();
      tl?.kill();
      gsap.killTweensOf([S, T]);
      splits.forEach((s) => s.revert());
      ctx.revert();
    },
  };
}