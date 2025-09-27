'use client';
import { useEffect, useState } from 'react';
import type { Shop } from '@/lib/affiliates';
import { shops } from '@/lib/affiliates';

type Item = { id:string; title:string; price:number; category:string; shopId:string; image?:string };

export default function Recommendations({ categories = [], preferredShops = [] }:{ categories?: string[], preferredShops?: string[] }){
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    async function load(){
      const res = await fetch('/api/recommendations');
      const data = await res.json();
      setItems(data);
    }
    load();
  }, []);

  const shopMap = Object.fromEntries(shops.map(s => [s.id, s])) as Record<string, Shop>;
  const filtered = items.filter(i => 
    (categories.length === 0 || categories.includes(i.category)) &&
    (preferredShops.length === 0 || preferredShops.includes(i.shopId))
  );

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map(i => (
        <a key={i.id} href="#" className="border rounded-2xl overflow-hidden bg-white">
          <div className="aspect-[4/3] bg-gray-100">
            {i.image ? <img src={i.image} alt={i.title} className="w-full h-full object-cover" /> : null}
          </div>
          <div className="p-4">
            <div className="font-medium">{i.title}</div>
            <div className="text-sm text-gray-600 mt-1">£{i.price.toFixed(2)} · {(shopMap[i.shopId]?.name) ?? i.shopId}</div>
          </div>
        </a>
      ))}
    </div>
  );
}
