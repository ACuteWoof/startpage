import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { IBM_Plex_Serif } from "next/font/google"

const ibmPlexSerif = IBM_Plex_Serif({ subsets: ["latin"], weight: "400" })
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Woof Startpage",
  description: "Custom startpage by ACuteWoof.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={ibmPlexSerif.className}>
        {children}
      </body>
    </html>
  );
}
