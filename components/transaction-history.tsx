"use client";

import { useState, useEffect } from "react";
import { Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/data";
import {
  getTransactionsFromLocalStorage,
  deleteTransactionFromLocalStorage,
  type TransactionData,
} from "@/lib/transaction-storage";

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    const data = getTransactionsFromLocalStorage();
    setTransactions(data.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleDelete = (transactionId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      deleteTransactionFromLocalStorage(transactionId);
      loadTransactions();
    }
  };

  const handleViewDetails = (transaction: TransactionData) => {
    setSelectedTransaction(transaction);
    setShowDetails(true);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Belum ada riwayat transaksi</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3">ID Transaksi</th>
              <th className="text-left py-2 px-3">ID Pelanggan</th>
              <th className="text-left py-2 px-3">Nominal</th>
              <th className="text-left py-2 px-3">Harga</th>
              <th className="text-left py-2 px-3">Pembayaran</th>
              <th className="text-left py-2 px-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.transactionId} className="border-b border-border hover:bg-secondary/50">
                <td className="py-2 px-3 font-mono text-xs">{transaction.transactionId}</td>
                <td className="py-2 px-3">{transaction.idPelanggan}</td>
                <td className="py-2 px-3">{transaction.nominal}</td>
                <td className="py-2 px-3">Rp {formatPrice(transaction.harga)}</td>
                <td className="py-2 px-3">{transaction.pembayaran}</td>
                <td className="py-2 px-3 space-x-2">
                  <button
                    onClick={() => handleViewDetails(transaction)}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <Eye className="h-3 w-3" />
                    Lihat
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.transactionId)}
                    className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                  >
                    <Trash2 className="h-3 w-3" />
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetails && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
            <h2 className="text-lg font-bold">Detail Transaksi</h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">ID Transaksi</p>
                <p className="font-mono font-semibold">{selectedTransaction.transactionId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">ID Pelanggan</p>
                <p className="font-semibold">{selectedTransaction.idPelanggan}</p>
              </div>
              <div>
                <p className="text-muted-foreground">ID Server</p>
                <p className="font-semibold">{selectedTransaction.idServer}</p>
              </div>
              <div>
                <p className="text-muted-foreground">ID SV</p>
                <p className="font-mono font-semibold">{selectedTransaction.idSv}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Kode Produk</p>
                <p className="font-mono font-semibold">{selectedTransaction.kodeProduk}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Nominal</p>
                <p className="font-semibold">{selectedTransaction.nominal}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Harga</p>
                <p className="font-semibold">Rp {formatPrice(selectedTransaction.harga)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Pembayaran</p>
                <p className="font-semibold">{selectedTransaction.pembayaran}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Code Key</p>
                <p className="font-mono font-semibold text-xs">{selectedTransaction.codeKey}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Const TRX</p>
                <p className="font-mono font-semibold text-xs">{selectedTransaction.constTrx}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Waktu</p>
                <p className="font-semibold">{new Date(selectedTransaction.timestamp).toLocaleString("id-ID")}</p>
              </div>
            </div>
            <Button
              onClick={() => setShowDetails(false)}
              className="w-full"
            >
              Tutup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
