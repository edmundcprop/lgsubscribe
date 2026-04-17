import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Subscribe Now — Build Your LG Appliance Plan",
  description:
    "Choose your LG appliances, pick a subscription plan (60 or 84 months), and get a personalised quote. Free delivery and installation across Malaysia. Plans start from RM50/month.",
  alternates: { canonical: "/enquire/" },
  openGraph: {
    title: "Subscribe Now — Build Your LG Appliance Plan",
    description:
      "Choose your LG appliances, pick a subscription plan, and get a personalised quote. Free delivery and installation across Malaysia.",
    url: absoluteUrl("/enquire/"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Subscribe Now — Build Your LG Appliance Plan",
    description:
      "Choose your LG appliances, pick a subscription plan, and get a personalised quote. Plans from RM50/month.",
  },
};

export default function EnquireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
