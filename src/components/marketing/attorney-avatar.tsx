import Image from "next/image";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const sizeConfig = {
  sm: { className: "h-10 w-10 text-sm", px: 40 },
  md: { className: "h-16 w-16 text-lg", px: 64 },
  lg: { className: "h-28 w-28 text-3xl", px: 112 },
} as const;

export function AttorneyAvatar({
  name,
  image,
  size = "md",
  className,
}: {
  name: string;
  image?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { className: sizeClassName, px } = sizeConfig[size];

  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={px}
        height={px}
        className={cn(
          "shrink-0 rounded-full border border-primary/40 object-cover",
          sizeClassName,
          className
        )}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-display text-primary",
        sizeClassName,
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
