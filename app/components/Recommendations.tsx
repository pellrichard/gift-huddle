import React from "react";
import Image from "next/image";

interface RecommendationItem {
  id: string;
  title: string;
  imageUrl: string;
}

export default function Recommendations({ items }: { items: RecommendationItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col items-center">
          <Image
            src={item.imageUrl}
            alt={item.title}
            width={96}
            height={96}
            className="h-24 w-24 rounded-xl object-cover"
          />
          <span>{item.title}</span>
        </div>
      ))}
    </div>
  );
}
