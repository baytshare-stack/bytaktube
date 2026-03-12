import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aura - Video Real Estate",
  description: "Discover extraordinary properties through video.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} antialiased bg-[#0f1115] text-white flex flex-col md:flex-row min-h-screen`}
      >
        <LanguageProvider>
          <AppProvider>
            {/* Sidebar Navigation */}
            <Navigation />
            
            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              {children}
            </main>
          </AppProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
