"use client";

import { useState, useMemo } from "react";
import { games } from "@/lib/data";
import { GameCard } from "@/components/game-card";
import { Flame } from "lucide-react";

const categories = [
  { id: "all", label: "Semua" },
  { id: "voucher", label: "Voucher" },
  { id: "top-up", label: "Top-Up" },
];

interface ProductSectionProps {
  searchQuery: string;
}

export function ProductSection({ searchQuery }: ProductSectionProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const hotProducts = useMemo(() => {
    return games.filter(
      (game) =>
        game.isTrending ||
        [
          "mobile-legends",
          "free-fire",
          "pubg-mobile",
          "genshin-impact",
          "honor-of-kings",
          "roblox",
        ].includes(game.id)
    );
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = games;

    if (searchQuery) {
      filtered = filtered.filter(
        (game) =>
          game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeCategory !== "all") {
      filtered = filtered.filter((game) => game.category === activeCategory);
    }

    return filtered;
  }, [searchQuery, activeCategory]);

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return games.length;
    return games.filter((game) => game.category === categoryId).length;
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {!searchQuery && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-bold text-foreground">Produk Hot</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {hotProducts.slice(0, 6).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-4">
          <h2 className="mb-4 text-lg font-bold text-foreground">Semua Produk</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {category.label}
                <span className="ml-1.5 text-xs opacity-70">
                  ({getCategoryCount(category.id)})
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {filteredProducts.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              Tidak ada produk yang ditemukan
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
