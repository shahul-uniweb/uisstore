// 192px WebP (7.8 KB) — the 256px PNG was 45.6 KB and Lighthouse flagged it as
// both oversized for its render box and in a legacy format.
import logoUrl from "@/assets/uis-store-logo.webp";

export function Logo({
  className = "h-10 w-10",
  alt = "UiS Store — e-commerce website packages in Kuwait by Uniweb IT Solutions",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={logoUrl}
      alt={alt}
      width={192}
      height={192}
      className={className}
      loading="eager"
      fetchPriority="high"
    />
  );
}
