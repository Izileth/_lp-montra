import { useEffect, useRef } from "react";
import gsap from "gsap";
import Navbar from "./Navbar";
import { BRAND, ROUTE_METADATA } from "../data/site";
import { navigate, useCurrentPath } from "../router";

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function NotFound() {
  const root = useRef<HTMLDivElement>(null);
  const currentPath = useCurrentPath();

  const meta = ROUTE_METADATA[currentPath] || {
    title: "Seção em Catalogação",
    category: "Expedição Botânica Não Concluída",
    code: "ERR-404",
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".js-404-hero", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
      }).from(
        ".js-404-card",
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.5"
      );
    }, root);

    return () => ctx.revert();
  }, [currentPath]);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/");
    }
  };

  return (
    <div
      ref={root}
      className="relative min-h-screen w-full overflow-hidden bg-[#051F20] text-[#DAF1DE] selection:bg-[#235347] selection:text-[#DAF1DE]"
    >
      {/* Navbar global */}
      <Navbar />

      {/* Textura de grão analógico idêntica à da home */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      {/* Halos de iluminação botânica de fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#163832]/30 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-[-10%] -z-0 h-[400px] w-[500px] rounded-full bg-[#0B2B26]/60 blur-[120px]"
      />

      {/* Conteúdo principal */}
      <main className="relative z-10 mx-auto flex max-w-[1400px] flex-col px-4 pt-28 pb-16 md:px-[18px] md:pt-36 md:pb-24">
        
        {/* Topo do Protocolo */}
        <div className="js-404-hero flex flex-wrap items-center justify-between gap-4 border-b border-[#163832] pb-6 font-mono text-[11px] uppercase tracking-wide text-[#8EB69B]">
          <div className="flex items-center gap-2.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[#8EB69B] animate-pulse" />
            <span className="font-semibold text-[#DAF1DE]">Status 404</span>
            <span className="text-[#8EB69B]/40">/</span>
            <span>Protocolo de Catalogação em Andamento</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-[#8EB69B]/80 md:text-[11px]">
            <span>Ref: {meta.code}</span>
            <span>·</span>
            <span>Mantiqueira · SP</span>
          </div>
        </div>

        {/* Bloco Central com Número Gigante & Título */}
        <div className="relative mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          
          <div className="lg:col-span-8">
            <p className="js-404-hero mb-3 font-mono text-[12px] uppercase tracking-wider text-[#8EB69B]">
              Observatório Botânico {BRAND.name} · Expedição Ativa
            </p>

            <h1 className="js-404-hero font-display text-[48px] font-medium leading-[0.92] tracking-[-0.045em] text-[#DAF1DE] sm:text-[68px] lg:text-[88px]">
              Página em <br />
              <span className="text-[#8EB69B]">Desenvolvimento.</span>
            </h1>

            <p className="js-404-hero mt-6 max-w-[58ch] font-mono text-[13px] leading-[1.75] tracking-wide text-[#DAF1DE]/90 md:text-[14px]">
              A seção <strong className="font-semibold text-[#8EB69B]">"{meta.title}"</strong> está
              sendo mapeada e documentada pelos botânicos e pesquisadores do observatório.
              Novos registros de herbário, lâminas taxonômicas e dados dendrológicos estarão
              disponíveis em breve para consulta pública.
            </p>

            {/* Ações / Botões */}
            <div className="js-404-hero mt-10 flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/"
                className="group inline-flex items-center gap-2 rounded-full bg-[#8EB69B] px-6 py-3.5 font-mono text-[11px] font-semibold uppercase leading-none tracking-wide text-[#051F20] transition duration-200 hover:bg-[#DAF1DE] hover:scale-[1.02]"
              >
                <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
                Voltar ao Catálogo Principal
              </a>

              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 rounded-full border border-[#8EB69B]/30 bg-[#0B2B26]/60 px-5 py-3.5 font-mono text-[11px] uppercase leading-none tracking-wide text-[#DAF1DE] backdrop-blur-md transition duration-200 hover:border-[#8EB69B]/70 hover:bg-[#163832]"
              >
                <span aria-hidden>↖</span>
                Retornar à Tela Anterior
              </button>
            </div>
          </div>

          {/* Destaque Numérico 404 estilizado como carimbo de herbário */}
          <div className="js-404-hero lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
            <div className="relative select-none">
              <span className="font-logo text-[130px] sm:text-[180px] lg:text-[210px] leading-none tracking-tight text-[#0B2B26] transition-colors duration-500 hover:text-[#163832]">
                404
              </span>
              <div className="absolute inset-x-0 bottom-4 flex flex-col items-start font-mono text-[10px] uppercase tracking-widest text-[#8EB69B]/70">
                <span className="border-t border-[#8EB69B]/30 pt-1 w-full">ARQUIVO TEMPORÁRIO</span>
                <span>COL. BOTÂNICA DENDROLÓGICA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ficha Técnica de Campo (Estilo Fichário de Herbário) */}
        <div className="mt-16 border-t border-[#163832] pt-10">
          <p className="js-404-card mb-6 font-mono text-[11px] uppercase tracking-wider text-[#8EB69B]">
            Ficha de Identificação do Registro //
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="js-404-card rounded-xl border border-[#163832] bg-[#0B2B26]/40 p-5 backdrop-blur-sm transition hover:border-[#235347]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8EB69B]">
                Destino Requisitado
              </span>
              <p className="mt-2 font-display text-[18px] font-medium text-[#DAF1DE]">
                {meta.title}
              </p>
              <span className="mt-1 block font-mono text-[11px] text-[#8EB69B]/70">
                Rota: {currentPath}
              </span>
            </div>

            <div className="js-404-card rounded-xl border border-[#163832] bg-[#0B2B26]/40 p-5 backdrop-blur-sm transition hover:border-[#235347]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8EB69B]">
                Classificação / Categoria
              </span>
              <p className="mt-2 font-display text-[18px] font-medium text-[#DAF1DE]">
                {meta.category}
              </p>
              <span className="mt-1 block font-mono text-[11px] text-[#8EB69B]/70">
                Ref. Taxonômica: {meta.code}
              </span>
            </div>

            <div className="js-404-card rounded-xl border border-[#163832] bg-[#0B2B26]/40 p-5 backdrop-blur-sm transition hover:border-[#235347]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8EB69B]">
                Status da Catalogação
              </span>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#8EB69B] animate-pulse" />
                <p className="font-display text-[18px] font-medium text-[#DAF1DE]">
                  Em Andamento
                </p>
              </div>
              <span className="mt-1 block font-mono text-[11px] text-[#8EB69B]/70">
                Coleta em campo ativa
              </span>
            </div>

            <div className="js-404-card rounded-xl border border-[#163832] bg-[#0B2B26]/40 p-5 backdrop-blur-sm transition hover:border-[#235347]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8EB69B]">
                Local de Preservação
              </span>
              <p className="mt-2 font-display text-[18px] font-medium text-[#DAF1DE]">
                {BRAND.address[0]}
              </p>
              <span className="mt-1 block font-mono text-[11px] text-[#8EB69B]/70">
                {BRAND.address[1]}
              </span>
            </div>
          </div>
        </div>

        {/* Sugestões de Navegação Rápida */}
        <div className="js-404-card mt-12 rounded-2xl border border-[#235347]/50 bg-[#0B2B26]/30 p-6 backdrop-blur-md md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wide text-[#8EB69B]">
                Enquanto esta página é finalizada
              </p>
              <h3 className="mt-1 font-display text-[22px] font-medium text-[#DAF1DE]">
                Explore os espécimes vivos no Carrossel Principal
              </h3>
              <p className="mt-1 max-w-[60ch] font-mono text-[12px] text-[#DAF1DE]/70">
                Conheça a Sequóia-Gigante, o Carvalho-Alvarinho, o Baobá Grandidier e outras árvores milenares já registradas.
              </p>
            </div>
            <a
              href="/"
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#8EB69B]/40 bg-[#051F20] px-5 py-3 font-mono text-[11px] uppercase tracking-wide text-[#DAF1DE] transition hover:border-[#8EB69B] hover:bg-[#163832]"
            >
              Abrir Carrossel →
            </a>
          </div>
        </div>

      </main>
    </div>
  );
}
