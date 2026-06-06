import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anime Logs v2",
  description: "Roblox dashboard logging and recovery console",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
