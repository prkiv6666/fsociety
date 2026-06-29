/**
 * Shop catalog. Prices are in EUR. Stock is NOT stored here — it lives in
 * the KV store under `stock:<id>` (a list of "email:password" lines), loaded
 * via the admin endpoint so credentials never touch the repo.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  priceEur: number;
  features?: string[];
}

// TODO: confirm prices.
export const PRODUCTS: Product[] = [
  {
    id: "mailbg",
    name: "Mail.bg Account",
    description: "Fresh Mail.bg email account — delivered instantly after payment.",
    priceEur: 0.5,
    features: ["Instant auto-delivery", "Fresh & unused", "email:password format"],
  },
  {
    id: "abvbg",
    name: "ABV.bg Account",
    description: "Fresh ABV.bg email account — delivered instantly after payment.",
    priceEur: 0.5,
    features: ["Instant auto-delivery", "Fresh & unused", "email:password format"],
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
