// Mock Google Search Console data for the admin panel. Shaped like the real
// Search Console API responses so it can be swapped for the live API later
// (Search Analytics query: dimensions = query / page / country / device / date).
//
// Replace the exports below with `fetch()` calls to your backend that proxies
// the Google Search Console API — the page components already consume this shape.

import { format, subDays } from "date-fns";

export type ScRow = { key: string; clicks: number; impressions: number; ctr: number; position: number };
export type ScDaily = { date: string; clicks: number; impressions: number };

// deterministic pseudo-random so the mock looks stable between renders
function seeded(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export const scSummary = {
  clicks: 1284,
  impressions: 48210,
  ctr: 0.0266, // 2.66%
  position: 12.4,
  // period-over-period deltas (fraction)
  clicksDelta: 0.18,
  impressionsDelta: 0.24,
  ctrDelta: 0.03,
  positionDelta: -1.6, // improved (lower is better)
};

export const scDaily: ScDaily[] = Array.from({ length: 28 }, (_, i) => {
  const base = 30 + Math.round(seeded(i) * 30) + Math.round(i * 0.9);
  return {
    date: format(subDays(new Date(), 27 - i), "MMM d"),
    clicks: base,
    impressions: base * (28 + Math.round(seeded(i + 5) * 20)),
  };
});

export const scQueries: ScRow[] = [
  { key: "ecommerce website kuwait", clicks: 214, impressions: 5120, ctr: 0.0418, position: 3.2 },
  { key: "online store kuwait", clicks: 168, impressions: 4390, ctr: 0.0383, position: 4.1 },
  { key: "uis store", clicks: 142, impressions: 1890, ctr: 0.0751, position: 1.4 },
  { key: "ecommerce packages kuwait", clicks: 96, impressions: 3020, ctr: 0.0318, position: 5.6 },
  { key: "knet payment gateway website", clicks: 74, impressions: 2680, ctr: 0.0276, position: 7.3 },
  { key: "متجر الكتروني الكويت", clicks: 63, impressions: 4110, ctr: 0.0153, position: 9.8 },
  { key: "uniweb it solutions", clicks: 58, impressions: 920, ctr: 0.063, position: 1.9 },
  { key: "arabic online store", clicks: 51, impressions: 2340, ctr: 0.0218, position: 8.4 },
  { key: "gcc delivery ecommerce", clicks: 44, impressions: 1980, ctr: 0.0222, position: 10.2 },
  { key: "ecommerce website price kuwait", clicks: 39, impressions: 2210, ctr: 0.0177, position: 11.5 },
  { key: "online shop kuwait", clicks: 33, impressions: 3560, ctr: 0.0093, position: 14.1 },
  { key: "best ecommerce platform kuwait", clicks: 28, impressions: 1740, ctr: 0.0161, position: 12.8 },
];

export const scPages: ScRow[] = [
  { key: "/", clicks: 812, impressions: 31200, ctr: 0.026, position: 9.4 },
  { key: "/#packages", clicks: 214, impressions: 8900, ctr: 0.024, position: 13.1 },
  { key: "/#features", clicks: 121, impressions: 4600, ctr: 0.0263, position: 15.2 },
  { key: "/#faq", clicks: 84, impressions: 2510, ctr: 0.0335, position: 11.7 },
  { key: "/#contact", clicks: 53, impressions: 1000, ctr: 0.053, position: 8.9 },
];

export const scCountries: { key: string; code: string; clicks: number; impressions: number }[] = [
  { key: "Kuwait", code: "KW", clicks: 742, impressions: 21400 },
  { key: "Saudi Arabia", code: "SA", clicks: 186, impressions: 9800 },
  { key: "United Arab Emirates", code: "AE", clicks: 142, impressions: 7600 },
  { key: "Qatar", code: "QA", clicks: 88, impressions: 4100 },
  { key: "Bahrain", code: "BH", clicks: 64, impressions: 2900 },
  { key: "Oman", code: "OM", clicks: 41, impressions: 1600 },
];

export const scDevices: { key: string; clicks: number; impressions: number }[] = [
  { key: "Mobile", clicks: 862, impressions: 30100 },
  { key: "Desktop", clicks: 361, impressions: 15900 },
  { key: "Tablet", clicks: 61, impressions: 2210 },
];

export const scAppearance: { key: string; clicks: number; impressions: number }[] = [
  { key: "Normal results", clicks: 1102, impressions: 41800 },
  { key: "FAQ rich results", clicks: 138, impressions: 5210 },
  { key: "Sitelinks", clicks: 44, impressions: 1200 },
];

// Index coverage / pages status (URL Inspection + Coverage report).
export const scCoverage = {
  indexed: 1,
  notIndexed: 0,
  discovered: 1,
  lastCrawl: format(subDays(new Date(), 2), "MMM d, yyyy"),
  sitemapSubmitted: true,
  mobileUsable: true,
  coreWebVitalsGood: true,
};
