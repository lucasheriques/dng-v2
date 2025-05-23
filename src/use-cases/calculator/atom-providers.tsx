"use client";

import { Provider } from "jotai";
import { ReactNode } from "react";

// Simple provider wrapper for all Jotai atoms
export function AtomProvider({ children }: { children: ReactNode }) {
  return <Provider>{children}</Provider>;
}
