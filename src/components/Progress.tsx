import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type ProgressProps = {
    active: number;
    total: number;
    onPrev: () => void;
    onNext: () => void;
};

const pad = (n: number) => String(n).padStart(2, "0");
const SEGMENT = 14;

export default function Progress({ active, total, onPrev, onNext }: ProgressProps) {
    const segRef = useRef<HTMLDivElement>(null);
    const numRef = useRef<HTMLSpanElement>(null);
    const first = useRef(true);

    useLayoutEffect(() => {
        const left = `${(active / (total - 1)) * (100 - SEGMENT)}%`;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (first.current || reduce) {
        gsap.set(segRef.current, { left });
        first.current = false;
        return;
        }

        const ctx = gsap.context(() => {
        gsap.to(segRef.current, { left, duration: 0.8, ease: "power3.inOut" });
        gsap.fromTo(
            numRef.current,
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
        );
        });
        return () => ctx.revert();
    }, [active, total]);

    const pill =
        "flex h-7 w-7 items-center justify-center rounded-full bg-[#051F20]/60 border border-[#8EB69B]/30 font-mono text-[12px] leading-none text-[#DAF1DE] backdrop-blur-sm transition hover:bg-[#163832] hover:border-[#8EB69B]";

    return (
        <div className="js-footer absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-[15px] pb-[15px] text-[#DAF1DE]">
        <div className="w-[min(254px,calc(100%-110px))] font-mono text-[10px] leading-none tracking-wide">
            <div className="mb-2 flex justify-between">
            <span className="inline-block overflow-hidden">
                <span ref={numRef} className="inline-block font-semibold text-[#DAF1DE]">{pad(active + 1)}</span>
            </span>
            <span className="text-[#8EB69B]">{pad(total)}</span>
            </div>
            <div className="relative h-px w-full bg-[#8EB69B]/30">
            <div ref={segRef} className="absolute -top-px h-[3px] bg-[#DAF1DE]" style={{ width: `${SEGMENT}%` }} />
            </div>
        </div>

        <div className="flex gap-1.5">
            <button type="button" onClick={onPrev} aria-label="Anterior" className={pill}>←</button>
            <button type="button" onClick={onNext} aria-label="Próximo" className={pill}>→</button>
        </div>
        </div>
    );
}
