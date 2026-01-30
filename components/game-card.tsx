"use client";

import Image from "next/image";
import Link from "next/link";
import type { Game } from "@/lib/data";
import { TrendingUp } from "lucide-react";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/purchase/${game.id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={game.image || "/placeholder.svg"}
            alt={game.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {game.isTrending && (
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
              <TrendingUp className="h-3 w-3" />
              Trending
            </div>
          )}
          
          {game.tag && (
            <div className="absolute bottom-2 left-2 rounded-md bg-primary/80 px-2 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
              {game.tag}
            </div>
          )}
        </div>
        
        <div className="p-3">
          <h3 className="text-sm font-semibold text-foreground line-clamp-1">
            {game.name}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
            {game.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
