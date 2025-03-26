import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "DevTools",
    description: "Collection d'outils pour les développeurs",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" className={inter.className}>
        <body>
            {children}
            <Analytics />
        </body>
        </html>
    );
}