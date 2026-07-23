"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      theme="dark"
      position="top-right"
      toastOptions={{
        style: {
          background: '#1a1d27',
          border: '1px solid #2a2d37',
          color: '#fff',
        },
      }}
    />
  );
}
