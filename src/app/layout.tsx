import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import Navbar from "@/components/navbar/Navbar";
import ThemeScript from "@/components/theme/ThemeScript";
import "./globals.css";
import "@/components/theme/theme.css";
import Preloader from "@/components/preloader/Preloader";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "My developer portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Preloader logoSrc="/images/logo.webp" />
        <ThemeScript />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
