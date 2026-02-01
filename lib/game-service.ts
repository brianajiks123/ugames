export interface Nominal {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    discount: number;
}

const parseItemPatterns: Record<string, { regex: RegExp; label: string }> = {
    diamondFull: { regex: /(\d{1,3}(?:\.\d{3})*|\d+)\s*DIAMOND/i, label: 'Diamond' },
    diamondShort: { regex: /(\d{1,3}(?:\.\d{3})*|\d+)D\b/i, label: 'Diamond' },
    vouchers: { regex: /(\d+)\s*VOUCHERS?/i, label: 'Voucher' },
    shell: { regex: /(\d+)\s*SHELL/i, label: 'Shell' },
    uc: { regex: /(\d+)\s*UC\b/i, label: 'UC' },
    pbCash: { regex: /(\d+)\s*PB/i, label: 'PB Cash' },
    cp: { regex: /(\d+)\s*CP/i, label: 'CP' },
    coupons: { regex: /(\d+)\s*Coupons/i, label: 'Coupons' },
    starQuartz: { regex: /Star Quartz\s*\*?\s*(\d+)/i, label: 'Star Quartz' },
    credits: { regex: /(\d+)\s*Credits/i, label: 'Credits' },
    ruby: { regex: /(\d+)\s*Ruby/i, label: 'Ruby' },
    bigCatCoins: { regex: /(\d+)\+(\d+)\s*Big Cat Coins/i, label: 'Big Cat Coins' },
    candies: { regex: /(\d+)\s*Candies/i, label: 'Candies' },
    goldenStar: { regex: /(\d+)\s*Golden Star/i, label: 'Golden Star' },
    gold: { regex: /(\d+)\s*Gold/i, label: 'Gold' },
    starCredits: { regex: /(\d+)\s*Star Credits/i, label: 'Star Credits' },
    coins: { regex: /(\d+)\s*Coins/i, label: 'Coins' },
    rc: { regex: /(\d+)\s*RC\b/i, label: 'RC' },
    steamIdr: { regex: /IDR\s*(\d{1,3}(?:[.,]\d{3})*|\d+)/i, label: 'IDR' },
    seaInvestment: { regex: /(\(SEA\)\s*Investment\s*.+)/i, label: '' },
    weeklyCard: { regex: /WEEKLY\s*CARD/i, label: 'Weekly Card' },
    superPass: { regex: /SUPER\s*PASS\b(?!\s*BUNDLE)/i, label: 'Super Pass' },
    superPassBundle: { regex: /SUPER\s*PASS\s*BUNDLE/i, label: 'Super Pass Bundle' },
    superVipCard: { regex: /SUPER\s*VIP\s*CARD/i, label: 'Super VIP Card' },
    monthlyCard: { regex: /MONTHLY\s*CARD/i, label: 'Monthly Card' },
};

function parseNominalDisplay(nama: string, operatorName?: string): string {
    let clean = nama.trim().replace(/\s+/g, ' ');
    if (!clean) return nama;

    // Metal Slug: remove "TOP UP" text
    if (operatorName?.toUpperCase().includes('METAL SLUG')) {
        clean = clean.replace(/TOP[-\s]?UP/gi, '').trim();
    }

    for (const [key, { regex, label }] of Object.entries(parseItemPatterns)) {
        const match = clean.match(regex);
        if (match) {
            if (key === 'bigCatCoins' && match[2]) {
                const total = Number(match[1]) + Number(match[2]);
                return `${total} ${label}`;
            }
            if (key === 'starQuartz') {
                return `${match[1]} ${label}`;
            }
            // Items without numeric amount (special cards, passes, etc.)
            if (['weeklyCard', 'superPass', 'superPassBundle', 'superVipCard', 'monthlyCard'].includes(key)) {
                return label;
            }
            // Dragon Raja: return full SEA Investment text
            if (key === 'seaInvestment') {
                return match[1];
            }
            // Steam IDR: format as "IDR 50.000"
            if (key === 'steamIdr') {
                const amount = match[1].replace(/[.,]/g, '');
                const formatted = Number(amount).toLocaleString('id-ID');
                return `IDR ${formatted}`;
            }
            const amount = match[1].replace(/\./g, '');
            return `${amount} ${label}`;
        }
    }

    return clean;
}

export interface Game {
    id: string;
    name: string;
    description: string;
    image: string;
    nominals: Nominal[];
    category: "all" | "voucher" | "top-up";
    isTrending?: boolean;
}

interface ApiProduct {
    sv_id: string;
    kode: string;
    nama: string;
    harga: string;
    tag: string | null;
    description: string;
    isPostpaid: boolean;
}

interface ApiOperator {
    operator: string;
    filterTag: string[];
    image: string;
    produk: ApiProduct[];
}

interface ApiResponse {
    status: number;
    data: ApiOperator[];
}

export async function fetchGames(): Promise<Game[]> {
    try {
        const response = await fetch(
            "https://portal.murapay.id/api/custom/Produk/parseProduk/voucher_game"
        );
        const result: ApiResponse = await response.json();

        if (result.status !== 200 || !Array.isArray(result.data)) {
            console.error("Invalid API response format");
            return [];
        }

        return result.data.map((op) => {
            let category: "all" | "voucher" | "top-up" = "all";

            const isVoucher = op.produk.some(p =>
                p.nama.toUpperCase().includes("VOUCHER") ||
                p.description.toUpperCase().includes("VOUCHER")
            );

            const isTopUp = op.produk.some(p =>
                p.nama.toUpperCase().includes("TOP UP") ||
                p.nama.toUpperCase().includes("TOP-UP") ||
                p.description.toUpperCase().includes("TOP UP") ||
                p.description.toUpperCase().includes("TOP-UP")
            );

            if (isVoucher) category = "voucher";
            else if (isTopUp) category = "top-up";

            const slug = op.operator.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

            const nominals: Nominal[] = op.produk.map((p) => {
                const price = parseInt(p.harga);
                const cleanName = parseNominalDisplay(p.nama, op.operator);

                return {
                    id: p.kode,
                    name: cleanName,
                    price: price,
                    originalPrice: price,
                    discount: 0,
                };
            });

            return {
                id: slug,
                name: op.operator,
                description: op.operator,
                image: `/operators/${op.operator}.webp`,
                nominals: nominals,
                category: category,
                isTrending: false,
            };
        });
    } catch (error) {
        console.error("Failed to fetch games:", error);
        return [];
    }
}

export function getCategoryFilter(game: Game, category: string): boolean {
    if (category === "all") return true;
    return game.category === category;
}
