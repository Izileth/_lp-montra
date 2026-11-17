import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Observer } from "gsap/Observer";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, CustomEase, Draggable, InertiaPlugin, Observer, SplitText);

/** Curvas do projeto: todas as transições usam só estas. */
export const EASE = {
  reveal: CustomEase.create("mReveal", "0.77, 0, 0.175, 1"), // máscaras (in-out firme)
  glide: CustomEase.create("mGlide", "0.22, 1, 0.36, 1"),    // deslocamento da galeria
  settle: CustomEase.create("mSettle", "0.16, 1, 0.3, 1"),   // zoom/assentamento de imagem
  in: CustomEase.create("mIn", "0.7, 0, 0.84, 0"),           // saídas
  out: CustomEase.create("mOut", "0.19, 1, 0.22, 1"),        // entradas
};

export { gsap, Draggable, InertiaPlugin, Observer, SplitText };