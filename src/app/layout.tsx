import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todoist",
  description: "Feature creep meets your first app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <AnimatedBackground>
            <div className="relative z-20">
              <Navbar />
            </div>
            <main className="mx-auto max-w-5xl text-xl flex flex-col gap-4 min-h-screen p-4">
              {children}
            </main>
          </AnimatedBackground>
        </SessionProvider>
      </body>
    </html>
  );
}
