type Props = {
    layers?: number;
    maxBlur?: number;
    ramp?: number;
    fadeOut?: number;
    tint?: number;
    tintColor?: string;
    className?: string;
};

export default function ProgressiveBlur({
    layers = 6,
    maxBlur = 14,
    ramp = 40,
    fadeOut = 14,
    tint = 0.3,
    tintColor = "5,31,32",
    className = "",
}: Props) {
    const step = ramp / layers;
    const holdEnd = 100 - fadeOut;
    const r = (v: number) => Math.round(v * 100) / 100;

    const tintMask = `linear-gradient(to bottom, transparent 0%, #000 ${ramp}%, #000 ${holdEnd}%, transparent 100%)`;

    return (
        // data-blur: alvo do GSAP. --k controla a intensidade (0 = sem blur, 1 = total)
        <div
            aria-hidden
            data-blur
            className={`pointer-events-none absolute ${className}`}
            style={{ ["--k" as string]: 1 }}
        >
            {Array.from({ length: layers }, (_, i) => {
                const blur = (maxBlur / 2 ** (layers - 1)) * 2 ** i;
                const mask = `linear-gradient(to bottom, transparent ${r(i * step)}%, #000 ${r(
                    (i + 1) * step
                )}%, #000 ${holdEnd}%, transparent 100%)`;
                const filter = `blur(calc(${r(blur)}px * var(--k, 1)))`;

                return (
                    <div
                        key={i}
                        className="absolute inset-0"
                        style={{
                            backdropFilter: filter,
                            WebkitBackdropFilter: filter,
                            maskImage: mask,
                            WebkitMaskImage: mask,
                        }}
                    />
                );
            })}

            {tint > 0 && (
                <div
                    className="absolute inset-0"
                    style={{
                        background: `rgba(${tintColor},${tint})`,
                        opacity: "var(--k, 1)",
                        maskImage: tintMask,
                        WebkitMaskImage: tintMask,
                    }}
                />
            )}
        </div>
    );
}