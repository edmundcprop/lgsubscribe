import siteData from "../data/site.json";

export const site = siteData;

export const whatsappLink = (message: string) =>
  `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;

export const absoluteUrl = (path = "") => {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${site.url}${clean === "/" ? "" : clean}`;
};
