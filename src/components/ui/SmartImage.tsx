import Image, { ImageProps } from "next/image";

/**
 * SmartImage - tiny wrapper around next/image so we can change defaults in one place later.
 * Usage: <SmartImage src="/path" alt="..." width={W} height={H} className="..." />
 */
export default function SmartImage(props: ImageProps) {
  return <Image {...props} />;
}
