export type Comparison = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  leftName: string;
  leftTagline: string;
  rightName: string;
  rightTagline: string;
  rows: { label: string; left: string; right: string; winner?: "left" | "right" | "tie" }[];
  conclusion: string;
  recommendedProductSlug?: string;
  recommendedProductCategory?: string;
};

import comparisonsData from "../data/comparisons.json";

export const comparisons: Comparison[] = comparisonsData as Comparison[];

export const getComparison = (slug: string) =>
  comparisons.find((c) => c.slug === slug);
