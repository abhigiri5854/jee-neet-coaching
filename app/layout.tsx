import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | JEE & NEET Online Coaching`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "JEE coaching",
    "NEET coaching",
    "online classes",
    "sample papers",
    "IIT JEE",
    "NEET UG",
  ],
  openGraph: {
    title: `${SITE.name} | JEE & NEET Online Coaching`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_IN",
    type: "website",
  },
  icons: { icon: "/icon.svg" },
};

async function currentUserName() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  const name =
    (data.user?.user_metadata?.full_name as string | undefined) ??
    data.user?.email ??
    null;
  return name;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userName = await currentUserName();

  return (
    <html lang="en" className={`${jakarta.variable} h-full`}>
      <body className={`${jakarta.className} flex min-h-full flex-col antialiased`}>
        <SiteHeader userName={userName} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
