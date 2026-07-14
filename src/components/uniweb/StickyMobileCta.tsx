import { openLeadForm } from "@/lib/lead-form";

export function StickyMobileCta() {
  return (
    <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40">
      <button
        type="button"
        onClick={openLeadForm}
        className="block w-full text-center rounded-full px-6 py-3.5 text-sm font-bold text-white bg-gradient-brand shadow-glow animate-pulse-glow"
      >
        Get Your Store Today
      </button>
    </div>
  );
}
