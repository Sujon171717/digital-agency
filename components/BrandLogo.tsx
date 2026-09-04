import Image from "next/image";
import { brand } from "@/lib/content";

export function BrandLogo({
  className = "h-11 w-auto",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={brand.logo}
      alt={brand.legalName}
      width={640}
      height={240}
      priority={priority}
      className={`bg-white object-contain ${className}`}
    />
  );
}
