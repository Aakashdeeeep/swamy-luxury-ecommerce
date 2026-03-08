import type { Metadata } from "next";
import { Cinzel, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "../components/SmoothScrollProvider";
import NavigationProgress from "../components/NavigationProgress";

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Swamy Jewellery — Timeless Gold & Diamond Jewellery Since 1998",
  description:
    "Discover Swamy Jewellery's exquisite collection of handcrafted gold, diamond, and antique jewellery. 100% Hallmarked, IGI Certified. Vadavalli, Coimbatore.",
  keywords: ["Swamy Jewellery", "Gold Jewellery", "Diamond", "Coimbatore", "Vadavalli", "Bridal", "Heritage"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body
        className={`${cinzel.variable} ${inter.variable} ${cormorant.variable} antialiased`}
        suppressHydrationWarning
      >
        <NavigationProgress />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
