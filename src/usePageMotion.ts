import { useEffect, type RefObject } from "react";

/** Reveal each section once; content remains visible without animation support. */
export function usePageMotion(
  root: RefObject<HTMLElement | null>,
  pathname: string,
) {
  useEffect(() => {
    const container = root.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!container || reduced.matches || !("IntersectionObserver" in window)) {
      return;
    }

    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        let order = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (reduced.matches) continue;
          const animation = entry.target.animate(
            [
              { opacity: 0, translate: "0 18px" },
              { opacity: 1, translate: "0 0" },
            ],
            {
              duration: 560,
              delay: Math.min(order++, 4) * 65,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "backwards",
            },
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        }
      },
      { threshold: 0.08 },
    );

    container
      .querySelectorAll(
        ".hero-copy > *, .hero-art, .principles > div, .section-heading, " +
          ".course-overview, .lesson-card, .hex-card, .closing, .page-heading, " +
          ".lesson-row, .reading-header, .goal-box, .prose-section, .example-box, " +
          ".quiz, .hex-detail-header, .guide-box, .classic-section, " +
          ".progress-summary, .about-content > section",
      )
      .forEach((element) => observer.observe(element));

    const stop = () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
    const onPreferenceChange = () => {
      if (reduced.matches) stop();
    };
    reduced.addEventListener("change", onPreferenceChange);
    return () => {
      stop();
      reduced.removeEventListener("change", onPreferenceChange);
    };
  }, [root, pathname]);
}
