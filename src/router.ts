import { useSyncExternalStore } from "react";

// Listener para mudanças de rota
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    notify();
  });

  // Intercepta cliques em links internos para navegação SPA suave
  window.addEventListener("click", (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) {
      return;
    }

    const anchor = (e.target as HTMLElement).closest("a");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    const target = anchor.getAttribute("target");

    if (
      !href ||
      target === "_blank" ||
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return;
    }

    if (href.startsWith("/")) {
      e.preventDefault();
      navigate(href);
    }
  });
}

export function navigate(to: string) {
  if (typeof window === "undefined") return;
  if (window.location.pathname === to && window.location.search === "") {
    return;
  }
  window.history.pushState(null, "", to);
  notify();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function useCurrentPath(): string {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => {
        listeners.delete(onStoreChange);
      };
    },
    () => (typeof window !== "undefined" ? window.location.pathname : "/"),
    () => "/"
  );
}
