"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Info, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGameById, formatPrice, generateTransactionId, paymentMethods } from "@/lib/data";
import type { Nominal, PaymentMethod } from "@/lib/data";
import { TransactionModal } from "@/components/transaction-modal";

export default function PurchasePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;
  const game = getGameById(gameId);

  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [selectedNominal, setSelectedNominal] = useState<Nominal | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [showTransaction, setShowTransaction] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const isFormValid = useMemo(() => {
    return userId.trim() !== "" && serverId.trim() !== "" && selectedNominal !== null && selectedPayment !== null;
  }, [userId, serverId, selectedNominal, selectedPayment]);

  const handleOrder = () => {
    if (!isFormValid) return;
    const newTransactionId = generateTransactionId();
    setTransactionId(newTransactionId);
    setShowTransaction(true);
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground mb-2">Game tidak ditemukan</h1>
          <Button onClick={() => router.push("/")} variant="outline">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-3xl items-center gap-4 px-4">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg">
              <Image
                src={game.image || "/placeholder.svg"}
                alt={game.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">{game.name}</h1>
              <p className="text-xs text-muted-foreground">{game.description}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* Section 1: User ID & Server ID */}
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
              1
            </span>
            <h2 className="font-semibold text-foreground">Masukkan User ID & Server ID</h2>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-secondary px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Server ID"
              value={serverId}
              onChange={(e) => setServerId(e.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-secondary px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>Masukkan User ID dan Server ID dengan benar untuk menghindari kesalahan pengiriman</p>
          </div>
        </section>

        {/* Section 2: Nominal */}
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
              2
            </span>
            <h2 className="font-semibold text-foreground">Pilih Nominal</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {game.nominals.map((nominal) => (
              <button
                key={nominal.id}
                type="button"
                onClick={() => setSelectedNominal(nominal)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  selectedNominal?.id === nominal.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary hover:border-primary/50"
                }`}
              >
                <p className="font-semibold text-foreground text-sm">{nominal.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-accent font-bold text-sm">
                    Rp {formatPrice(nominal.price)}
                  </span>
                  <span className="rounded bg-accent/20 px-1.5 py-0.5 text-xs font-medium text-accent">
                    -{nominal.discount}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-through">
                  Rp {formatPrice(nominal.originalPrice)}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Section 3: Payment Method */}
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
              3
            </span>
            <h2 className="font-semibold text-foreground">Pilih Pembayaran</h2>
          </div>

          <p className="mb-3 text-xs text-muted-foreground">QRIS</p>

          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedPayment(method)}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                  selectedPayment?.id === method.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary hover:border-primary/50"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium text-foreground">{method.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Section 4: Order Details */}
        {userId && serverId && selectedNominal && (
          <section className="rounded-xl border border-border bg-card p-4 animate-in slide-in-from-bottom-4 duration-300">
            <h2 className="font-semibold text-foreground mb-3">Detail Pesanan</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Produk</span>
                <span className="text-foreground font-medium">{selectedNominal.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Harga</span>
                <span className="text-accent font-medium">
                  Rp {formatPrice(selectedNominal.price)}
                </span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-accent">
                    Rp {formatPrice(selectedNominal.price)}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur p-4">
        <div className="container mx-auto max-w-3xl">
          <Button
            onClick={handleOrder}
            disabled={!isFormValid}
            className={`w-full h-12 font-semibold text-base transition-all ${
              isFormValid
                ? "bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {isFormValid
              ? `Bayar Rp ${formatPrice(selectedNominal?.price || 0)}`
              : "Pilih Paket Terlebih Dahulu"}
          </Button>
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showTransaction}
        onClose={() => setShowTransaction(false)}
        transactionId={transactionId}
        userId={userId}
        serverId={serverId}
        productName={selectedNominal?.name || ""}
        paymentMethod={selectedPayment?.name || ""}
        price={selectedNominal?.price || 0}
      />
    </div>
  );
}
