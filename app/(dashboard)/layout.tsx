"use client";

import { Sidebar } from "@/components/app-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 pt-16 lg:pt-6 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
