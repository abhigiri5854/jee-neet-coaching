"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-navy">Something went wrong</h1>
      <p className="mt-3 text-muted-foreground">
        Please try again. If this continues, refresh the page.
      </p>
      <Button type="button" onClick={reset} className="mt-8 h-11 px-5">
        Try again
      </Button>
    </div>
  );
}
