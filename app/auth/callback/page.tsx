"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CallbackPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const next = params.get("next") || "/app";
    router.replace(next);
  }, [params, router]);

  return null;
}
