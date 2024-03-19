import "./globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: "Dustin Ichigo Coding Test Submission",
  description:
    "Dustin DeHaven made this page for the Ichigo Coding Test.  I hope you like it!",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
