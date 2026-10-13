"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  name: string;
  /** Fixed pixel size (width + height). Ignored when fill is true. */
  size?: number;
  /** Responsive fill mode — parent must be relative with a set size. */
  fill?: boolean;
  sizes?: string;
  className?: string;
  fallbackClassName?: string;
};

/** Hero portrait sprite (next/image) with initials fallback if the image is missing. */
export default function HeroIcon({ src, name, size, fill, sizes, className, fallbackClassName }: Props) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return <span className={fallbackClassName}>{name.slice(0, 2).toUpperCase()}</span>;
  }
  if (fill) {
    return (
      <Image
        src={src}
        alt={`${name} portrait`}
        fill
        sizes={sizes ?? "60px"}
        loading="lazy"
        draggable={false}
        onError={() => setBroken(true)}
        className={className}
      />
    );
  }
  const px = size ?? 32;
  return (
    <Image
      src={src}
      alt={`${name} portrait`}
      width={px}
      height={px}
      loading="lazy"
      draggable={false}
      onError={() => setBroken(true)}
      className={className}
    />
  );
}
