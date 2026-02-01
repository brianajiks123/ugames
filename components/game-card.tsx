"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Game } from "@/lib/game-service";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const [imgSrc, setImgSrc] = useState(game.image);

  return (
    <Link href={`/purchase/${game.id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={imgSrc || "/operators/default.webp"}
            alt={game.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgSrc("/operators/default.webp")}
          />
        </div>

        <div className="p-3">
          <h3 className="text-sm text-center font-semibold text-foreground line-clamp-1">
            {game.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
