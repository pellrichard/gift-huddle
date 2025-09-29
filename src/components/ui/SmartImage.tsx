import Image, { ImageProps } from "next/image";

// Enforce an `alt` prop to satisfy jsx-a11y/alt-text.
type SmartImageProps = Omit<ImageProps, "alt"> & { alt: string };

export default function SmartImage({ alt, ...rest }: SmartImageProps) {
  return <Image alt={alt} {...rest} />;
}
