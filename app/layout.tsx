import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import { site, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Subscribe LG Appliances from RM60/month`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "LG Subscribe Malaysia",
    "LG subscription",
    "LG appliance rental Malaysia",
    "LG PuriCare",
    "LG aircond subscription",
    "LG water purifier Malaysia",
    "home appliance subscription Malaysia",
    "LG Malaysia",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  alternates: {
    canonical: "/",
    languages: {
      "en-MY": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: absoluteUrl("/"),
    siteName: site.name,
    title: `${site.name} — Subscribe LG Appliances from RM60/month`,
    description: site.description,
    images: [
      {
        url: "/uploads/site/scenario-upgrade-15.avif",
        width: 1600,
        height: 1062,
        alt: "LG Subscribe Malaysia — premium home appliances",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Subscribe LG Appliances from RM60/month`,
    description: site.description,
    images: [
      "/uploads/site/scenario-upgrade-15.avif",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#A50034",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-MY">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var l=localStorage.getItem('lang');if(l==='ms')document.documentElement.lang='ms';}catch(e){}`,
          }}
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-KJDZCLBFYG" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-KJDZCLBFYG');`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
