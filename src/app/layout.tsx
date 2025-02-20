import "bootstrap/dist/css/bootstrap.min.css";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import Header from "@/app/components/Header";
import BackgroundLines from "./components/BackgroundLines";
import { cookies } from "next/headers";
// import LightModeToggle from "@/app/components/LightModeToggle"; // Client Component for toggling
import { config } from '@fortawesome/fontawesome-svg-core';


import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get light mode preference from cookies
  const cookieStore: any = cookies();
  const lightMode = cookieStore.get("lightMode")?.value === "true";

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${lightMode ? "light" : ""}`}>
        <div className="mi-wrapper">
          <BackgroundLines />
          <Header lightMode={lightMode} />
          {children}
        </div>
      </body>
    </html>
  );
}
