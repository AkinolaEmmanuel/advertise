import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "pòlówó — Free storefront for WhatsApp sales",
  description:
    "Create a free online storefront for WhatsApp and bank transfer sales. Unlimited products, one link, built for Nigerian sellers.",
};

const themeScript = `
  try {
    var t = localStorage.getItem('polowo-theme');
    if (t === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        id="top"
        className={`${inter.variable} ${outfit.variable} antialiased selection:bg-primary selection:text-primary-foreground`}
      >
        <ThemeProvider>
          <QueryProvider>
            {children}
            <Toaster position="top-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
