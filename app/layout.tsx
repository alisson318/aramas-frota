import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aramas Tur — Frota",
  description:
    "Frota premium Aramas Tur. Marcopolo Paradiso DD 2020 com leito-cama e internet Starlink.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${plusJakarta.variable} h-full antialiased md:snap-y md:snap-mandatory`}>
      <head>
        <noscript>
          <style>{'[data-reveal], [data-hero] { visibility: visible !important; }'}</style>
        </noscript>
      </head>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
