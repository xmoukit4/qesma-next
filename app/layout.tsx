
import { Inter } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/hooks/useLocale";
import { AuthProvider } from "@/context/AuthContext";
import { Navigation } from "@/components/navigation";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 dark:bg-gray-900`}>
        <div className="relative min-h-screen">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/50 dark:via-purple-900/50 dark:to-pink-900/50 blur-3xl opacity-50"></div>
          <main className="relative z-10">
            <AuthProvider>
              <LocaleProvider>
                <Navigation />
                {children}
                <Toaster />
              </LocaleProvider>
            </AuthProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
