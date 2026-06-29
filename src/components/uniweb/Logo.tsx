import logoAsset from "@/assets/uniweb-logo.png.asset.json";

export function Logo({ className = "h-10 w-10", alt = "Uniweb IT Solutions" }: { className?: string; alt?: string }) {
  return <img src={logoAsset.url} alt={alt} className={className} loading="eager" />;
}