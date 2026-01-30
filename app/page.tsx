"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Banner } from "@/components/banner";
import { SearchBar } from "@/components/search-bar";
import { ProductSection } from "@/components/product-section";
import { WhyChooseUs } from "@/components/why-choose-us";
import { LoginModal } from "@/components/login-modal";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={() => setIsLoginOpen(true)} />

      <main className="container mx-auto space-y-8 px-4 py-6">
        <Banner />
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <ProductSection searchQuery={searchQuery} />
        <WhyChooseUs />
      </main>

      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            2026 UGames. All rights reserved.
          </p>
        </div>
      </footer>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
