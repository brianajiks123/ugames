"use client";

import { X, Copy, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/data";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  userId: string;
  serverId: string;
  productName: string;
  paymentMethod: string;
  price: number;
}

export function TransactionModal({
  isOpen,
  onClose,
  transactionId,
  userId,
  serverId,
  productName,
  paymentMethod,
  price,
}: TransactionModalProps) {
  const [copied, setCopied] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScroll = () => {
      const isScrollable = container.scrollHeight > container.clientHeight;
      const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 20;
      setShowScrollHint(isScrollable && !isAtBottom);
    };

    checkScroll();
    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToBottom = () => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth"
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />
      <div
        ref={scrollContainerRef}
        className="relative w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto scrollbar-hide animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="rounded-2xl border border-border bg-card shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card p-4 rounded-t-2xl">
            <h2 className="text-lg font-bold text-foreground">Detail Transaksi</h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="rounded-xl border border-border bg-secondary/50 p-4">
              <p className="text-xs text-muted-foreground mb-1">ID Transaksi</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-foreground">
                  {transactionId}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label="Copy transaction ID"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-secondary/50 p-4">
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">User ID</p>
                  <p className="font-semibold text-foreground">{userId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Server ID</p>
                  <p className="font-semibold text-foreground">{serverId}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-secondary/50 p-4">
              <h3 className="font-semibold text-foreground mb-3">Pesanan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Produk</span>
                  <span className="text-foreground font-medium">{productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pembayaran</span>
                  <span className="text-foreground font-medium">{paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Harga</span>
                  <span className="text-foreground font-medium">
                    Rp {formatPrice(price)}
                  </span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-accent">
                      Rp {formatPrice(price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-secondary/50 p-4">
              <h3 className="font-semibold text-foreground mb-3 text-center">
                Scan QRIS untuk Pembayaran
              </h3>
              <div className="flex justify-center mb-3">
                <div className="rounded-xl bg-white p-4">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PAYMENT-${transactionId}-${price}`}
                    alt="QR Code Payment"
                    width={180}
                    height={180}
                    loading="lazy"
                    className="rounded-lg"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                Scan kode QRIS di atas menggunakan aplikasi pembayaran digital Anda
              </p>
            </div>
          </div>

          <div className="sticky bottom-0 border-t border-border bg-card rounded-b-2xl">
            {showScrollHint && (
              <div
                className="absolute -top-16 left-0 right-0 h-16 bg-gradient-to-t from-card via-card/80 to-transparent pointer-events-none"
                aria-hidden="true"
              />
            )}
            {showScrollHint && (
              <div className="flex justify-center py-2">
                <button
                  type="button"
                  onClick={scrollToBottom}
                  className="flex items-center gap-1 text-muted-foreground text-xs animate-bounce"
                  aria-label="Scroll down for more"
                >
                  <ChevronDown className="h-4 w-4" />
                  <span>Scroll untuk melihat lebih</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="px-4 pb-4">
              <Button
                onClick={onClose}
                className="w-full h-12 bg-gradient-to-r from-primary to-accent text-white font-semibold hover:opacity-90"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
