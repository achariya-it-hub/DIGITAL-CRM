import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";

const lexend = Lexend_Deca({ variable: "--font-lexend", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DigitalCRM — Team Workspace",
  description: "Projects, tasks, milestones, meetings & calls — all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lexend.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-lexend), sans-serif" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
