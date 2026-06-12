import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "pòlówó — Create your own online store",
  description:
    "Turn your products into a professional online storefront in 60 seconds. The visual-first storefront for small businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body id="top" className={`${inter.variable} antialiased selection:bg-white selection:text-black`}>
        <QueryProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#18181b",
                color: "#fafafa",
                border: "1px solid #27272a",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
