"use client";

import { useState, useMemo, useEffect } from "react";
import { fetchGames, Game } from "@/lib/game-service";
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
  const [visibleCount, setVisibleCount] = useState(12);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGames() {
      try {
        const data = await fetchGames();
        setGames(data);
      } catch (error) {
        console.error("Failed to load games", error);
      } finally {
        setLoading(false);
      }
    }
    loadGames();
  }, []);

  const hotProducts = useMemo(() => {
    return games.slice(0, 6);
  }, [games]);

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
  }, [searchQuery, activeCategory, games]);

  useMemo(() => {
    setVisibleCount(12);
  }, [activeCategory, searchQuery]);

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return games.length;
    return games.filter((game) => game.category === categoryId).length;
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  if (loading) {
    return <div className="py-12 text-center">Loading games...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {!searchQuery && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-bold text-foreground">Produk Hot</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {hotProducts.map((game, index) => (
              <GameCard key={`${game.id}-hot-${index}`} game={game} />
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
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${activeCategory === category.id
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

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredProducts.slice(0, visibleCount).map((game, index) => (
            <GameCard key={`${game.id}-${index}`} game={game} />
          ))}
        </div>

        {filteredProducts.length > visibleCount && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleShowMore}
              className="rounded-full bg-secondary px-6 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              Tampilkan Lainnya...
            </button>
          </div>
        )}

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
