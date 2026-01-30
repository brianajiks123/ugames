"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const banners = [
  {
    id: 1,
    image: "/banners/promo-ml.jpg",
    title: "PROMO SPECIAL",
    subtitle: "Mobile Legends Bang Bang",
    description: "Bonus 5 Diamonds untuk Top Up 50K+",
    period: "10 Januari - 5 Februari 2026",
  },
  {
    id: 2,
    image: "/banners/flash-sale.jpg",
    title: "FLASH SALE",
    subtitle: "Free Fire",
    description: "Diskon 25% untuk semua nominal",
    period: "Hanya hari ini!",
  },
  {
    id: 3,
    image: "/banners/genshin-promo.jpg",
    title: "NEW ARRIVAL",
    subtitle: "Genshin Impact",
    description: "Top up Genesis Crystal dengan harga spesial",
    period: "Promo terbatas",
  },
];

export function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-xl">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="relative min-w-full">
            <div className="relative aspect-[20/3] w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 to-accent/20">
              <Image
                src={banner.image || "/placeholder.svg"}
                alt={banner.title}
                fill
                className="object-cover opacity-30"
                priority
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent sm:text-sm">
                  {banner.title}
                </span>
                <h2 className="mb-2 text-balance text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
                  {banner.subtitle}
                </h2>
                <p className="mb-2 text-sm text-muted-foreground sm:text-base">
                  {banner.description}
                </p>
                <span className="text-xs text-muted-foreground">
                  {banner.period}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all ${idx === currentSlide
              ? "w-6 bg-primary"
              : "w-2 bg-muted-foreground/50"
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
