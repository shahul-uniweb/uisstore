import logoUrl from "@/assets/uis-store-logo-edited.png";

export function Logo({ className = "h-10 w-10", alt = "Uniweb IT Solutions" }: { className?: string; alt?: string }) {
  return <img src={logoUrl} alt={alt} className={className} loading="eager" />;
}