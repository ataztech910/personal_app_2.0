import "bootstrap/dist/css/bootstrap.min.css";
import { Noto_Sans } from "next/font/google";
import "./globals.scss";
import Header from "@/app/components/Header";
import BackgroundLines from "./components/BackgroundLines";
import { cookies } from "next/headers";
import { config } from "@fortawesome/fontawesome-svg-core";

import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

const geistSans = Noto_Sans({
  subsets: ["latin"],
});

const geistMono = Noto_Sans({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get light mode preference from cookies
  const cookieStore = await cookies();
  const lightMode = cookieStore.get("lightMode")?.value === "true";

  return (
    <html lang="en">
      <body
        className={`${geistSans.className} ${geistMono.className} ${
          lightMode ? "light" : ""
        }`}
      >
        <div className="mi-wrapper">
          <BackgroundLines />
          <Header lightMode={lightMode} />
          {children}
        </div>
      </body>
    </html>
  );
}
