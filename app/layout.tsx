import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JSON Schema Ecosystem | Observability Dashboard",
  description: "Automated observability and reporting of the JSON Schema ecosystem over time.",
  keywords: ["JSON Schema", "Ecosystem", "Observability", "Open Source", "Metrics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
              <Navigation />
            </header>
            <main className="flex-1 overflow-y-auto subtle-scroll">
              <div className="container relative py-8 px-4 md:px-8 max-w-7xl mx-auto">
                {children}
              </div>
            </main>
            <footer className="border-t py-6 md:px-8 md:py-0">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built for the JSON Schema community. Data updated weekly.
                </p>
              </div>
            </footer>
          </div>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
