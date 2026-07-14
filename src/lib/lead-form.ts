// Tiny decoupled bridge so any CTA anywhere on the page can open the lead-capture
// popup without threading props/context through every component. The LeadPopup
// listens for this event; buttons dispatch it.

const OPEN_EVENT = "uis:open-lead-form";

export function openLeadForm(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

export function onOpenLeadForm(handler: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}
