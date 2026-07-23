import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { db } from "@/lib/db";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await db.seoSettings.findUnique({ where: { id: "singleton" } });
  const profile = await db.profile.findUnique({ where: { id: "singleton" } });

  const siteUrl = seo?.siteUrl ?? "https://mdazeezsoftdev.vercel.app";
  const title = seo?.siteTitle ?? `${profile?.name ?? "Portfolio"} — Java Full Stack Developer`;
  const description = seo?.siteDescription ?? "";
  const keywords = seo?.keywords ? JSON.parse(seo.keywords) : [];

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords,
    authors: profile ? [{ name: profile.name }] : [],
    openGraph: {
      title: seo?.ogTitle ?? title,
      description: seo?.ogDescription ?? description,
      url: siteUrl,
      siteName: profile?.name ?? "Portfolio",
      images: seo?.ogImage
        ? [{ url: seo.ogImage, width: 1200, height: 630 }]
        : [{ url: "/og-image.png", width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: (seo?.twitterCard as "summary_large_image") ?? "summary_large_image",
      title: seo?.twitterTitle ?? title,
      description: seo?.twitterDescription ?? description,
      images: seo?.ogImage ? [seo.ogImage] : ["/og-image.png"],
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = await db.profile.findUnique({ where: { id: "singleton" } });

  const jsonLd = profile
    ? {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        mainEntity: {
          "@type": "Person",
          name: profile.name,
          jobTitle: profile.title,
          email: `mailto:${profile.email}`,
          url: "https://mdazeezsoftdev.vercel.app",
          sameAs: [profile.linkedin, profile.github],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Chennai",
            addressRegion: "Tamil Nadu",
            addressCountry: "IN",
          },
        },
      }
    : null;

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('portfolio-theme');if(t){document.documentElement.setAttribute('data-theme',t);}}catch(e){}`,
          }}
        />
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
