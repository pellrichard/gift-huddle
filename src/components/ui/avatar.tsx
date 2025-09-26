import * as React from "react";

export const Avatar = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-100 ${className}`} {...props} />
);

export const AvatarImage = ({ src, alt = "", className = "", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={src || ""} alt={alt} className={`h-full w-full object-cover ${className}`} {...props} />
);

export const AvatarFallback = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`text-gray-500 ${className}`} {...props}>{children}</div>
);
