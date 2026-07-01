"use client";

import { Toaster } from "sonner";

export function ToasterWrapper() {
  return (
    <Toaster
      position="top-right"
      theme="system"
      toastOptions={{
        classNames: {
          toast: "group",
          description: "group-hover:opacity-100",
        },
      }}
    />
  );
}