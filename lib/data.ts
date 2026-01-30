export interface Game {
  id: string;
  name: string;
  description: string;
  image: string;
  category: "top-up" | "voucher";
  tag?: string;
  isTrending?: boolean;
  nominals: Nominal[];
}

export interface Nominal {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export const games: Game[] = [
  {
    id: "mobile-legends",
    name: "Mobile Legends",
    description: "Top up Diamond ML",
    image: "/games/mobile-legends.jpg",
    category: "top-up",
    tag: "MOBA",
    isTrending: true,
    nominals: [
      { id: "ml-5", name: "5 Diamonds", price: 1500, originalPrice: 2000, discount: 25 },
      { id: "ml-12", name: "12 Diamonds", price: 3500, originalPrice: 4500, discount: 22 },
      { id: "ml-28", name: "28 Diamonds", price: 8000, originalPrice: 10000, discount: 20 },
      { id: "ml-56", name: "56 Diamonds", price: 15000, originalPrice: 19000, discount: 21 },
      { id: "ml-85", name: "85 Diamonds", price: 23000, originalPrice: 28000, discount: 18 },
      { id: "ml-170", name: "170 Diamonds", price: 45000, originalPrice: 55000, discount: 18 },
      { id: "ml-296", name: "296 Diamonds", price: 78000, originalPrice: 95000, discount: 18 },
      { id: "ml-568", name: "568 Diamonds", price: 148000, originalPrice: 180000, discount: 18 },
      { id: "ml-1155", name: "1155 Diamonds", price: 295000, originalPrice: 360000, discount: 18 },
      { id: "ml-2195", name: "2195 Diamonds", price: 550000, originalPrice: 680000, discount: 19 },
    ],
  },
  {
    id: "free-fire",
    name: "Free Fire",
    description: "Top up Diamond FF",
    image: "/games/free-fire.jpg",
    category: "top-up",
    tag: "Battle Royale",
    isTrending: true,
    nominals: [
      { id: "ff-5", name: "5 Diamonds", price: 1000, originalPrice: 1200, discount: 17 },
      { id: "ff-12", name: "12 Diamonds", price: 2400, originalPrice: 2900, discount: 17 },
      { id: "ff-50", name: "50 Diamonds", price: 7500, originalPrice: 9000, discount: 17 },
      { id: "ff-100", name: "100 Diamonds", price: 15000, originalPrice: 18000, discount: 17 },
      { id: "ff-310", name: "310 Diamonds", price: 45000, originalPrice: 54000, discount: 17 },
      { id: "ff-520", name: "520 Diamonds", price: 75000, originalPrice: 90000, discount: 17 },
    ],
  },
  {
    id: "pubg-mobile",
    name: "PUBG Mobile",
    description: "Top up UC PUBG",
    image: "/games/pubg-mobile.jpg",
    category: "top-up",
    tag: "Battle Royale",
    nominals: [
      { id: "pubg-60", name: "60 UC", price: 15000, originalPrice: 18000, discount: 17 },
      { id: "pubg-325", name: "325 UC", price: 75000, originalPrice: 90000, discount: 17 },
      { id: "pubg-660", name: "660 UC", price: 150000, originalPrice: 180000, discount: 17 },
      { id: "pubg-1800", name: "1800 UC", price: 375000, originalPrice: 450000, discount: 17 },
    ],
  },
  {
    id: "genshin-impact",
    name: "Genshin Impact",
    description: "Top up Genesis Crystal",
    image: "/games/genshin-impact.jpg",
    category: "top-up",
    tag: "RPG",
    nominals: [
      { id: "gi-60", name: "60 Genesis Crystal", price: 16000, originalPrice: 19000, discount: 16 },
      { id: "gi-330", name: "330 Genesis Crystal", price: 79000, originalPrice: 95000, discount: 17 },
      { id: "gi-1090", name: "1090 Genesis Crystal", price: 249000, originalPrice: 299000, discount: 17 },
      { id: "gi-2240", name: "2240 Genesis Crystal", price: 479000, originalPrice: 579000, discount: 17 },
    ],
  },
  {
    id: "honor-of-kings",
    name: "Honor of Kings",
    description: "Top up Tokens",
    image: "/games/honor-of-kings.jpg",
    category: "top-up",
    tag: "MOBA",
    nominals: [
      { id: "hok-8", name: "8 Tokens", price: 1600, originalPrice: 2000, discount: 20 },
      { id: "hok-30", name: "30 Tokens", price: 6000, originalPrice: 7500, discount: 20 },
      { id: "hok-80", name: "80 Tokens", price: 16000, originalPrice: 20000, discount: 20 },
      { id: "hok-200", name: "200 Tokens", price: 40000, originalPrice: 50000, discount: 20 },
    ],
  },
  {
    id: "roblox",
    name: "Roblox",
    description: "Top up Robux",
    image: "/games/roblox.jpg",
    category: "top-up",
    tag: "Sandbox",
    nominals: [
      { id: "rbx-80", name: "80 Robux", price: 15000, originalPrice: 18000, discount: 17 },
      { id: "rbx-400", name: "400 Robux", price: 70000, originalPrice: 85000, discount: 18 },
      { id: "rbx-800", name: "800 Robux", price: 140000, originalPrice: 170000, discount: 18 },
      { id: "rbx-1700", name: "1700 Robux", price: 280000, originalPrice: 340000, discount: 18 },
    ],
  },
  {
    id: "pokemon-unite",
    name: "Pokemon Unite",
    description: "Top up Aeos Gems",
    image: "/games/pokemon-unite.jpg",
    category: "top-up",
    tag: "MOBA",
    nominals: [
      { id: "pu-60", name: "60 Aeos Gems", price: 15000, originalPrice: 18000, discount: 17 },
      { id: "pu-250", name: "250 Aeos Gems", price: 59000, originalPrice: 71000, discount: 17 },
      { id: "pu-490", name: "490 Aeos Gems", price: 115000, originalPrice: 139000, discount: 17 },
    ],
  },
  {
    id: "arena-of-valor",
    name: "Arena of Valor",
    description: "Top up Voucher AOV",
    image: "/games/arena-of-valor.jpg",
    category: "top-up",
    tag: "MOBA",
    nominals: [
      { id: "aov-20", name: "20 Vouchers", price: 3000, originalPrice: 3600, discount: 17 },
      { id: "aov-90", name: "90 Vouchers", price: 13500, originalPrice: 16200, discount: 17 },
      { id: "aov-200", name: "200 Vouchers", price: 29000, originalPrice: 35000, discount: 17 },
    ],
  },
  {
    id: "clash-royale",
    name: "Clash Royale",
    description: "Top up Gems CR",
    image: "/games/clash-royale.jpg",
    category: "top-up",
    tag: "Strategy",
    nominals: [
      { id: "cr-80", name: "80 Gems", price: 15000, originalPrice: 18000, discount: 17 },
      { id: "cr-500", name: "500 Gems", price: 75000, originalPrice: 90000, discount: 17 },
      { id: "cr-1200", name: "1200 Gems", price: 150000, originalPrice: 180000, discount: 17 },
    ],
  },
  {
    id: "lol-wild-rift",
    name: "LoL Wild Rift",
    description: "Top up Wild Cores",
    image: "/games/lol-wild-rift.jpg",
    category: "top-up",
    tag: "MOBA",
    nominals: [
      { id: "wr-425", name: "425 Wild Cores", price: 65000, originalPrice: 79000, discount: 18 },
      { id: "wr-1000", name: "1000 Wild Cores", price: 150000, originalPrice: 182000, discount: 18 },
      { id: "wr-2000", name: "2000 Wild Cores", price: 295000, originalPrice: 360000, discount: 18 },
    ],
  },
  {
    id: "steam-wallet",
    name: "Steam Wallet",
    description: "Steam Wallet Code",
    image: "/games/steam-wallet.jpg",
    category: "voucher",
    tag: "Voucher",
    nominals: [
      { id: "steam-60", name: "IDR 60.000", price: 63000, originalPrice: 66000, discount: 5 },
      { id: "steam-120", name: "IDR 120.000", price: 125000, originalPrice: 132000, discount: 5 },
      { id: "steam-250", name: "IDR 250.000", price: 260000, originalPrice: 275000, discount: 5 },
      { id: "steam-400", name: "IDR 400.000", price: 415000, originalPrice: 440000, discount: 6 },
    ],
  },
  {
    id: "google-play",
    name: "Google Play",
    description: "Google Play Gift Card",
    image: "/games/google-play.jpg",
    category: "voucher",
    tag: "Voucher",
    nominals: [
      { id: "gp-50", name: "IDR 50.000", price: 50000, originalPrice: 52500, discount: 5 },
      { id: "gp-100", name: "IDR 100.000", price: 100000, originalPrice: 105000, discount: 5 },
      { id: "gp-150", name: "IDR 150.000", price: 150000, originalPrice: 157500, discount: 5 },
      { id: "gp-300", name: "IDR 300.000", price: 300000, originalPrice: 315000, discount: 5 },
    ],
  },
  {
    id: "playstation",
    name: "PlayStation",
    description: "PSN Card",
    image: "/games/playstation.jpg",
    category: "voucher",
    tag: "Voucher",
    nominals: [
      { id: "psn-100", name: "IDR 100.000", price: 100000, originalPrice: 105000, discount: 5 },
      { id: "psn-200", name: "IDR 200.000", price: 200000, originalPrice: 210000, discount: 5 },
      { id: "psn-300", name: "IDR 300.000", price: 300000, originalPrice: 315000, discount: 5 },
      { id: "psn-500", name: "IDR 500.000", price: 500000, originalPrice: 525000, discount: 5 },
    ],
  },
  {
    id: "megaxus",
    name: "Megaxus",
    description: "Voucher Megaxus",
    image: "/games/megaxus.jpg",
    category: "voucher",
    tag: "Voucher",
    nominals: [
      { id: "mx-10", name: "10.000 MI Cash", price: 10000, originalPrice: 10500, discount: 5 },
      { id: "mx-20", name: "20.000 MI Cash", price: 20000, originalPrice: 21000, discount: 5 },
      { id: "mx-50", name: "50.000 MI Cash", price: 50000, originalPrice: 52500, discount: 5 },
    ],
  },
  {
    id: "delta-force",
    name: "Delta Force",
    description: "Top up Delta Force",
    image: "/games/delta-force.jpg",
    category: "top-up",
    tag: "FPS",
    nominals: [
      { id: "df-100", name: "100 Coins", price: 15000, originalPrice: 18000, discount: 17 },
      { id: "df-500", name: "500 Coins", price: 70000, originalPrice: 85000, discount: 18 },
      { id: "df-1000", name: "1000 Coins", price: 135000, originalPrice: 165000, discount: 18 },
    ],
  },
];

export const paymentMethods: PaymentMethod[] = [
  {
    id: "qris",
    name: "QRIS (Semua E-Wallet & Bank)",
    category: "QRIS",
    icon: "/qris-icon.svg",
  },
  {
    id: "gopay",
    name: "GoPay",
    category: "E-Wallet",
    icon: "/gopay-icon.svg",
  },
  {
    id: "ovo",
    name: "OVO",
    category: "E-Wallet",
    icon: "/ovo-icon.svg",
  },
  {
    id: "dana",
    name: "DANA",
    category: "E-Wallet",
    icon: "/dana-icon.svg",
  },
];

export const hotProducts = games.filter((game) => game.isTrending || ["mobile-legends", "free-fire", "pubg-mobile", "genshin-impact", "honor-of-kings", "roblox"].includes(game.id));

export const getGameById = (id: string): Game | undefined => {
  return games.find((game) => game.id === id);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("id-ID").format(price);
};

export const generateTransactionId = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "TRX";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
