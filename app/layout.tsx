import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import ConsentBanner from "@/components/ConsentBanner";
import AnalyticsListeners from "@/components/AnalyticsListeners";
import { site, absoluteUrl } from "@/lib/site";

const GTM_ID = "GTM-K7G8ZKWJ";

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
        <Script id="consent-default" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`}
        </Script>
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var l=localStorage.getItem('lang');if(l==='ms')document.documentElement.lang='ms';}catch(e){}`,
          }}
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFab />
        <ConsentBanner />
        <AnalyticsListeners />
      </body>
    </html>
  );
}
