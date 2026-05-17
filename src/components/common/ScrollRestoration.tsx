"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scrolls the active scroll container to the top on every route change.
 * Works with both `.scroll-page` and `.no-scroll-page` layouts.
 */
export function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    // Try the page-level scroll container first
    const scroller = document.querySelector<HTMLElement>(".scroll-page, .no-scroll-page");
    if (scroller) {
      scroller.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    // Fallback to window scroll
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
