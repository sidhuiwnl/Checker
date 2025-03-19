import type { Metadata } from "next";

import {DM_Sans} from "next/font/google";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import {ThemeProvider} from "@/components/theme-provide";

export const metadata: Metadata = {
  title: "Checker",
  description: "A uptime app checker",
};

const font = DM_Sans({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${font.className} antialiased`}
          >
          <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          </body>
        </html>
      </ClerkProvider>
  );
}
