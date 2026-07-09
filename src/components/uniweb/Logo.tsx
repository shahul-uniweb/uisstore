import logoUrl from "@/assets/uis-store-logo-edited.png";

export function Logo({
  className = "h-10 w-10",
  alt = "UiS Store — e-commerce website packages in Kuwait by Uniweb IT Solutions",
}: {
  className?: string;
  alt?: string;
}) {
  return <img src={logoUrl} alt={alt} width={941} height={941} className={className} loading="eager" />;
}