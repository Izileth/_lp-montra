type Props = {
    layers?: number;      // quantidade de camadas (mais = transição mais suave)
    maxBlur?: number;     // blur máximo em px, na base
    className?: string;
};

export default function ProgressiveBlur({ layers = 5, maxBlur = 10, className = "" }: Props) {
    const step = 100 / (layers + 1);
    const clamp = (v: number) => Math.min(100, Math.round(v * 100) / 100);

    return (
        <div aria-hidden className={`pointer-events-none absolute -z-10 ${className}`}>
            {Array.from({ length: layers }, (_, i) => {
                // blur cresce de forma exponencial: ~0.3px … maxBlur
                const blur = (maxBlur / 2 ** (layers - 1)) * 2 ** i;
                const mask = `linear-gradient(to bottom, transparent ${clamp(i * step)}%, #000 ${clamp(
                    (i + 1) * step
                )}%, #000 ${clamp((i + 2) * step)}%, transparent ${clamp((i + 3) * step)}%)`;

                return (
                    <div
                        key={i}
                        className="absolute inset-0"
                        style={{
                            backdropFilter: `blur(${blur}px)`,
                            WebkitBackdropFilter: `blur(${blur}px)`,
                            maskImage: mask,
                            WebkitMaskImage: mask,
                        }}
                    />
                );
            })}
        </div>
    );
}