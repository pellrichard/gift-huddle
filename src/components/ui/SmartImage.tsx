import Image, { ImageProps } from "next/image";
type SmartImageProps = Omit<ImageProps, "alt"> & { alt: string };
export default function SmartImage({ alt, ...rest }: SmartImageProps) {
  return <Image alt={alt} {...rest} />;
}
