import logoUrl from "@/assets/uis-store-logo-256.png";

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
      width={256}
      height={256}
      className={className}
      loading="eager"
      fetchPriority="high"
    />
  );
}