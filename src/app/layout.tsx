import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Desa Binanga",
  description: "Portal Resmi Pemerintahan Desa Binanga",
  icons: {
    icon: "/pic/logo-soon.png",
  },
};

import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <NextTopLoader color="#16803C" showSpinner={false} height={3} />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
