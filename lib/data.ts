import {
  Database,
  Clock,
  Lock,
  Zap,
  Bell,
  ShieldCheck,
  Headphones,
  FileCheck,
  MessagesSquare,
  BadgeCheck,
  CreditCard,
  Globe,
  Send,
  PackageCheck,
  type LucideIcon,
} from "lucide-react";

// Single source of truth for the official contact.
export const TELEGRAM_HANDLE = "@fsocietyr3fs";
export const TELEGRAM_URL = "https://t.me/fsocietyr3fs";

// Public vouches / proof channel.
export const VOUCHES_URL = "https://t.me/+_ixcj8eF6c83MDY8";

// Full store list channel.
export const STORES_URL = "https://t.me/+NbpIJfy2ZaY5OWM0";

export interface Step {
  icon: LucideIcon;
  title: string;
  text: string;
}

// "We'll walk you through it" — the order process, step by step.
export const howItWorks: Step[] = [
  {
    icon: Send,
    title: "Contact us on Telegram",
    text: "Message us and tell us exactly what you want — the store, the item, and any details.",
  },
  {
    icon: FileCheck,
    title: "Send your order & account",
    text: "Share your order and your store account. We confirm the price, limits, and timeframe up front.",
  },
  {
    icon: PackageCheck,
    title: "We do the rest",
    text: "We place the order and handle everything end to end, keeping you updated until it's delivered.",
  },
];

// Vouch / proof screenshots shown in the carousel.
// Drop image files into public/vouches/ and list their filenames here.
export const vouchImages: string[] = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpg",
  "9.jpg",
  "10.jpg",
  "11.jpg",
  "12.jpg",
];

export type Region =
  | "Worldwide"
  | "Europe"
  | "UK"
  | "USA"
  | "USA/Canada"
  | "Available on request";

export interface Store {
  name: string;
  region: Region;
  // Optional expandable details shown when a store card is clicked.
  website?: string;
  limit?: string;
  timeframe?: string;
  worksIn?: string;
  minOrder?: string;
  fee?: string;
  note?: string;
}

export const stores: Store[] = [
  {
    name: "Autodoc",
    region: "Worldwide",
    website: "autodoc.bg",
    limit: "500€ / 5 items",
    timeframe: "14–30 days",
    minOrder: "250€",
    fee: "25%",
  },
  {
    name: "About You",
    region: "Worldwide",
    website: "aboutyou.com",
    limit: "500€ / 15 items",
    timeframe: "15–20 days",
    minOrder: "250€",
    fee: "25%",
    note: "On hold",
  },
  {
    name: "Modivo",
    region: "Worldwide",
    website: "modivo.bg",
    limit: "500€ / 15 items",
    timeframe: "14–30 days",
    minOrder: "250€",
    fee: "25%",
  },
  {
    name: "Obuvki BG",
    region: "Worldwide",
    website: "obuvki.bg",
    limit: "500€ / 15 items",
    timeframe: "14–30 days",
    minOrder: "250€",
    fee: "25%",
  },
  {
    name: "BestSecret",
    region: "Worldwide",
    website: "bestsecret.com",
    limit: "500€ / 15 items",
    timeframe: "14–30 days",
    minOrder: "250€",
    fee: "25%",
    note: "Aged account needed",
  },
  {
    name: "Apple",
    region: "Worldwide",
    website: "apple.com",
    limit: "3000€ / 1 item (dips available)",
    timeframe: "14–30 days",
    fee: "25%",
  },
  {
    name: "Ikea",
    region: "Worldwide",
    website: "ikea.com",
    limit: "2000€ / no item limit",
    timeframe: "1–3 days",
    minOrder: "500€",
    fee: "25%",
  },
  {
    name: "Zara",
    region: "Worldwide",
    website: "zara.com",
    limit: "250€ / 5 items",
    timeframe: "1–3 days",
    minOrder: "100€",
    fee: "25%",
  },
  {
    name: "Pull & Bear",
    region: "Worldwide",
    website: "pullandbear.com",
    limit: "150€ / 1–10 items",
    timeframe: "1–5 days",
    minOrder: "75€",
    fee: "25%",
  },
  {
    name: "H&M",
    region: "Worldwide",
    website: "hm.com",
    limit: "250€ / 10 items",
    timeframe: "1–7 days",
    minOrder: "100€",
    fee: "25%",
  },
  {
    name: "Manscaped",
    region: "Worldwide",
    website: "manscaped.com",
    limit: "200€ / 5 items",
    timeframe: "3–7 days",
    minOrder: "75€",
    fee: "25%",
  },
  {
    name: "Secretlab",
    region: "Worldwide",
    website: "secretlab.eu",
    limit: "1000€ / 1 item",
    timeframe: "5–10 days",
    minOrder: "500€",
    fee: "25%",
  },
  {
    name: "Oysho",
    region: "Worldwide",
    website: "oysho.com",
    limit: "200€ / 5 items",
    timeframe: "3–5 days",
    minOrder: "100€",
    fee: "25%",
  },
  {
    name: "Ralph Lauren",
    region: "Worldwide",
    website: "ralphlauren.eu",
    limit: "500€ / 5 items",
    timeframe: "7–14 days",
    minOrder: "100€",
    fee: "25%",
  },
  {
    name: "Alo Yoga",
    region: "Worldwide",
    website: "aloyoga.com",
    limit: "1000€ / 5 items",
    timeframe: "5–10 days",
    minOrder: "100€",
    fee: "25%",
  },
  {
    name: "PayPal / Bank",
    region: "Worldwide",
    limit: "5000€",
  },
  {
    name: "Gymshark",
    region: "Worldwide",
    website: "gymshark.com",
    limit: "400€ / 10 items",
    timeframe: "1–5 days",
    minOrder: "200€",
    fee: "25%",
  },
  {
    name: "Mango",
    region: "Worldwide",
    website: "shop.mango.com",
    limit: "400€ / 6 items",
    timeframe: "3–5 days",
    minOrder: "100€",
    fee: "25%",
  },
  {
    name: "PlayStation",
    region: "Worldwide",
    website: "direct.playstation.com",
    limit: "1000€ / 1 item",
    timeframe: "7–14 days",
    worksIn: "Doesn't ship to BG",
    minOrder: "150€",
    fee: "25%",
  },
  {
    name: "On Running",
    region: "Worldwide",
    website: "on.com",
    limit: "1000€ / 5 items",
    timeframe: "3–5 days",
    minOrder: "100€",
    fee: "25%",
  },
  {
    name: "Eyerim",
    region: "Worldwide",
    website: "eyerim.bg",
    limit: "300€ / 1 item",
    timeframe: "1–7 days",
    minOrder: "100€",
    fee: "25%",
  },
  {
    name: "Stradivarius",
    region: "Worldwide",
    website: "stradivarius.com",
    limit: "250€ / 5 items",
    timeframe: "1–10 days",
    minOrder: "100€",
    fee: "25%",
  },
  {
    name: "Puma",
    region: "Worldwide",
    website: "puma.com",
    limit: "400€ / 5 items",
    timeframe: "1–10 days",
    minOrder: "100€",
    fee: "25%",
  },
  {
    name: "Cropp",
    region: "Worldwide",
    website: "cropp.com",
    limit: "250€ / 5 items",
    timeframe: "1–10 days",
    minOrder: "100€",
    fee: "25%",
  },
  {
    name: "Temu",
    region: "Worldwide",
    website: "temu.com",
    limit: "500€ / 20 items",
    timeframe: "7–14 days",
    minOrder: "250€",
    fee: "25%",
  },
  { name: "Google Store", region: "Worldwide" },
  { name: "Logitech", region: "Worldwide" },
  { name: "Oura Ring", region: "Worldwide" },
  { name: "Dyson", region: "Worldwide" },
  { name: "Ring", region: "Worldwide" },
  { name: "Farfetch", region: "Europe" },
  { name: "Giorgio Armani", region: "Worldwide" },
  { name: "Prada", region: "Available on request" },
  { name: "Victoria's Secret", region: "Worldwide" },
  { name: "Shein", region: "Worldwide" },
  { name: "Sports Direct", region: "Worldwide" },

  // UK store list
  { name: "Bowers & Wilkins", region: "UK", limit: "£2k, 10 items", timeframe: "21 days" },
  { name: "Bose", region: "UK", limit: "£3k, 10 items", timeframe: "14–21 days" },
  { name: "Puma", region: "UK", limit: "£2k, 20 items", timeframe: "14 days" },
  { name: "Samsonite", region: "UK", limit: "£1k, 10 items", timeframe: "14 days" },
  { name: "American Tourister", region: "UK", limit: "£1.5k, 8 items", timeframe: "14 days" },
  { name: "LG", region: "UK", limit: "£3k, 3 items", timeframe: "14 days" },
  { name: "Bang & Olufsen", region: "UK", limit: "£3k, 15 items", timeframe: "14–21 days" },
  { name: "The North Face", region: "UK", limit: "£1k, 10 items", timeframe: "14–21 days" },
  { name: "Ray Ban", region: "UK", limit: "£3k, 10 items", timeframe: "14 days" },
  { name: "Valentino", region: "UK", limit: "£5k, 5 items", timeframe: "14–21 days" },
  { name: "Anker", region: "UK", limit: "£1k, 4 items", timeframe: "14 days" },
  { name: "Ninja", region: "UK", limit: "£5k, 20 items", timeframe: "14–21 days" },
  { name: "Adidas", region: "UK", limit: "£3k, 10 items", timeframe: "14–21 days" },
  { name: "Polo Ralph Lauren", region: "UK", limit: "£4k, 20 items", timeframe: "14 days" },
  { name: "Victoria's Secret", region: "UK", limit: "£2k, 20 items", timeframe: "14 days" },
  { name: "Tommy Hilfiger", region: "UK", limit: "£1k, 20 items", timeframe: "14–21 days" },
  { name: "Calvin Klein", region: "UK", limit: "£1k, 20 items", timeframe: "7–21 days" },
  { name: "Ebay", region: "UK", limit: "£1k, 3 items", timeframe: "14–21 days" },
  { name: "Marks & Spencer", region: "UK", limit: "£4k, 15 items", timeframe: "14 days" },
  { name: "Zara", region: "UK", limit: "£500, 20 items", timeframe: "14 days" },
  { name: "Asos", region: "UK", limit: "£200, 10 items", timeframe: "14 days" },
  { name: "Pandora", region: "UK", limit: "£300, 5 items", timeframe: "14 days" },
  { name: "Carl Friedrik", region: "UK", limit: "£2k, 3 items", timeframe: "14–21 days" },
  { name: "Giorgio Armani", region: "UK", limit: "£1.5k, 5 items", timeframe: "21 days" },
  { name: "Loro Piana", region: "UK", limit: "£800, 2 items", timeframe: "21 days" },
  { name: "AllSaints", region: "UK", limit: "£2.5k, 20 items", timeframe: "14 days" },
  { name: "Burberry", region: "UK", limit: "£10k, 3 items", timeframe: "21–28 days" },
  { name: "Givenchy", region: "UK", limit: "£5k, 3 items", timeframe: "14 days" },
  { name: "H&M", region: "UK", limit: "£2k, 20 items", timeframe: "14 days" },
  { name: "Hugo Boss", region: "UK", limit: "£1k, 10 items", timeframe: "14 days" },
  { name: "Jimmy Choo", region: "UK", limit: "£10k, 3 items", timeframe: "14–28 days" },
  { name: "Lululemon", region: "UK", limit: "£3k, 30 items", timeframe: "14 days" },
  { name: "Montblanc", region: "UK", limit: "£5k, 5 items", timeframe: "14–21 days" },
  { name: "Roborock", region: "UK", limit: "£3k, 7 items", timeframe: "14 days" },
  { name: "Sephora", region: "UK", limit: "£2k, 10 items", timeframe: "14–21 days" },
  { name: "Sunglass Hut", region: "UK", limit: "£3k, 10 items", timeframe: "21 days" },
  { name: "UGG", region: "UK", limit: "£2k, 5 items", timeframe: "14 days" },
  { name: "Vans", region: "UK", limit: "£3k, 10 items", timeframe: "14 days" },
  { name: "Versace", region: "UK", limit: "£5k, 5 items", timeframe: "21–28 days" },
  { name: "Asics", region: "UK", limit: "£500, 5 items", timeframe: "14 days" },
  { name: "Tom Ford", region: "UK", limit: "£1.5k, 5 items", timeframe: "14 days" },
  { name: "Lacoste", region: "UK", limit: "£1k, 5 items", timeframe: "14–21 days" },
  { name: "Palm Angels", region: "UK", limit: "£2.5k, 20 items", timeframe: "14–21 days" },
  { name: "Nike", region: "UK", limit: "£1k, 2 items", timeframe: "14–21 days" },
  { name: "McLaren Store", region: "UK", limit: "£3k, 5 items", timeframe: "14 days" },
  { name: "OnePlus", region: "UK", limit: "£2k, 1 item", timeframe: "14–21 days" },
  { name: "Nikon", region: "UK", limit: "£3k, 3 items", timeframe: "14–21 days" },
  {
    name: "Back Market",
    region: "UK",
    limit: "£3k, 2 items (same devices)",
    timeframe: "21 days",
    note: "Hard store — expect multiple back-and-forth",
  },
  { name: "Logitech", region: "UK", limit: "£1k, 10 items", timeframe: "14–21 days" },
  { name: "Urban Outfitters", region: "UK", limit: "£1k, 10 items", timeframe: "14–21 days" },
  { name: "New Balance", region: "UK", limit: "£500, 2 items", timeframe: "14–21 days" },
  {
    name: "Arcteryx",
    region: "UK",
    limit: "£2k, 5 items",
    timeframe: "21–28 days",
    note: "Needs a solid SE and some pushing",
  },
  { name: "NinjaKitchen", region: "UK", limit: "£3k, 10 items", timeframe: "14 days" },
  { name: "Steelseries", region: "UK", limit: "£3k, 10 items", timeframe: "14 days" },
];

export interface Feature {
  icon: LucideIcon;
  title: string;
  text: string;
}

export const features: Feature[] = [
  {
    icon: Database,
    title: "Big Store List",
    text: "A wide, curated catalog of supported stores across multiple regions, updated as availability changes.",
  },
  {
    icon: Clock,
    title: "24/7 Service",
    text: "The channel stays active around the clock so requests and questions never sit waiting.",
  },
  {
    icon: Lock,
    title: "Private Access",
    text: "A discreet, members-first environment built around trust and direct communication.",
  },
  {
    icon: Zap,
    title: "Fast Support",
    text: "Quick, clear responses and guidance so you always know the next step.",
  },
];

export interface Service {
  icon: LucideIcon;
  title: string;
  text: string;
}

export const services: Service[] = [
  {
    icon: Bell,
    title: "Store availability updates",
    text: "Stay informed when supported stores and regions change.",
  },
  {
    icon: Lock,
    title: "Private service access",
    text: "Members-only access handled through the official channel.",
  },
  {
    icon: Headphones,
    title: "Customer support guidance",
    text: "Friendly help that walks you through each step clearly.",
  },
  {
    icon: FileCheck,
    title: "Case preparation help",
    text: "Organized guidance to get your request ready the right way.",
  },
  {
    icon: MessagesSquare,
    title: "Fast communication",
    text: "Direct, responsive messaging with minimal waiting.",
  },
  {
    icon: BadgeCheck,
    title: "Vouches and proof",
    text: "Regular, transparent proof posted in the official channel.",
  },
  {
    icon: CreditCard,
    title: "Multiple payment options",
    text: "Flexible, convenient options to suit your preference.",
  },
  {
    icon: Globe,
    title: "Worldwide options",
    text: "Coverage spanning global and region-specific availability.",
  },
];

export interface Reason {
  icon: LucideIcon;
  title: string;
  text: string;
}

export const reasons: Reason[] = [
  {
    icon: Zap,
    title: "Clean and simple process",
    text: "No clutter, no confusion — a straightforward path from question to answer.",
  },
  {
    icon: ShieldCheck,
    title: "Private and secure communication",
    text: "Conversations stay discreet inside the official channel.",
  },
  {
    icon: Headphones,
    title: "Active support",
    text: "A responsive presence ready to help whenever you reach out.",
  },
  {
    icon: Bell,
    title: "Regular updates",
    text: "Frequent posts keep availability and news current.",
  },
  {
    icon: BadgeCheck,
    title: "Serious service only",
    text: "A focused, professional space — no noise, only the service.",
  },
  {
    icon: Lock,
    title: "Trusted community presence",
    text: "An established, reputable channel members can rely on.",
  },
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Stores", href: "#stores" },
  { label: "Shop", href: "#shop" },
  { label: "Process", href: "#how-it-works" },
  { label: "Vouches", href: "#vouches" },
  { label: "Contact", href: "#contact" },
];

