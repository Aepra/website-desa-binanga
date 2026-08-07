import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://desa.binanga.web.id"),
  title: {
    default: "Desa Binanga - Portal Resmi Pemerintahan Desa Binanga, Sendana, Majene",
    template: "%s | Desa Binanga",
  },
  description: "Website Resmi Pemerintahan Desa Binanga, Kecamatan Sendana, Kabupaten Majene, Sulawesi Barat. Layanan administrasi mandiri persuratan warga, berita desa, produk UMKM, destinasi wisata, dan transparansi anggaran.",
  keywords: [
    "Binanga",
    "Desa Binanga",
    "Desa Binanga Sendana",
    "Desa Binanga Majene",
    "Website Desa Binanga",
    "Portal Desa Binanga",
    "Layanan Desa Binanga",
    "Profil Desa Binanga",
    "Kecamatan Sendana",
    "Kabupaten Majene",
    "Sulawesi Barat"
  ],
  authors: [{ name: "Pemerintah Desa Binanga" }],
  creator: "Pemerintah Desa Binanga",
  publisher: "Pemerintah Desa Binanga",
  icons: {
    icon: "/pic/logo-soon.png",
  },
  openGraph: {
    title: "Desa Binanga - Portal Resmi Pemerintahan Desa Binanga",
    description: "Website Resmi Pemerintahan Desa Binanga, Kecamatan Sendana, Kabupaten Majene, Sulawesi Barat.",
    url: "https://desa.binanga.web.id",
    siteName: "Desa Binanga",
    locale: "id_ID",
    type: "website",
  },
  alternates: {
    canonical: "https://desa.binanga.web.id",
  },
  verification: {
    google: "ujIHV5N2kQ-pG-RDi9Kl_YTJmZ0NeJhF3mX1Tpja9-o",
  },
};

import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "name": "Pemerintah Desa Binanga",
    "alternateName": "Desa Binanga",
    "url": "https://desa.binanga.web.id",
    "logo": "https://desa.binanga.web.id/pic/logo-soon.png",
    "description": "Portal Resmi Pemerintahan Desa Binanga, Kecamatan Sendana, Kabupaten Majene, Sulawesi Barat.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Binanga",
      "addressRegion": "Kecamatan Sendana, Kabupaten Majene",
      "addressCountry": "ID"
    }
  };

  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <NextTopLoader color="#16803C" showSpinner={false} height={3} />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
