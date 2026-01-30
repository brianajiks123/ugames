"use client";

import { CreditCard, Gift, Zap, BadgeDollarSign } from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Metode Pembayaran Lengkap",
    description: "Pilihan pembayaran mudah untuk transaksi voucher game",
  },
  {
    icon: Gift,
    title: "Promosi Menarik",
    description: "Nikmati banyak promo spesial untuk game favoritmu",
  },
  {
    icon: Zap,
    title: "Proses Instan",
    description: "Top up game favoritmu secara cepat dan instan",
  },
  {
    icon: BadgeDollarSign,
    title: "Harga Terjangkau",
    description: "Voucher game dengan harga termurah",
  },
];

export function WhyChooseUs() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <h2 className="mb-6 text-center text-lg font-bold text-foreground">
        Mengapa Memilih Kami?
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col items-center rounded-xl border border-border bg-card p-4 text-center transition-colors hover:border-primary/30"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <feature.icon className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-foreground">
              {feature.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
