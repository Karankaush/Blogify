// app/feed/layout.js
"use client";
import { Suspense } from "react";

export default function FeedLayout({ children }) {
  return (
    <Suspense fallback={<p className="text-center animate-pulse">Loading...</p>}>
      {children}
    </Suspense>
  );
}