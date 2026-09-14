export function scrollChildIntoView(
  container: HTMLElement | null,
  selector: string,
): void {
  if (!container) {
    return;
  }

  const target = container.querySelector(selector);

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  target.scrollIntoView({
    block: "nearest",
    inline: "nearest",
    behavior: isReducedMotion ? "auto" : "smooth",
  });
}
