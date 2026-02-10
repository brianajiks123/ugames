import crypto from 'crypto';

export interface TransactionData {
    idPelanggan: string;
    idServer: string;
    idSv: string;
    kodeProduk: string;
    nominal: number;
    harga: number;
    pembayaran: string;
    constTrx: string;
    codeKey: string;
    transactionId: string;
    timestamp: number;
}

export function generateCodeKey(data: Omit<TransactionData, 'codeKey'>): string {
    const dataString = `${data.idPelanggan}${data.idServer}${data.idSv}${data.kodeProduk}${data.nominal}${data.harga}${data.constTrx}${data.timestamp}`;

    const hash = crypto
        .createHash('sha256')
        .update(dataString)
        .digest('hex')
        .substring(0, 16)
        .toUpperCase();

    return hash;
}

export function saveTransactionToLocalStorage(transactionData: Omit<TransactionData, 'codeKey'>): TransactionData {
    const codeKey = generateCodeKey(transactionData);
    const fullData: TransactionData = {
        ...transactionData,
        codeKey,
    };

    if (typeof window !== 'undefined') {
        const transactions = getTransactionsFromLocalStorage();
        transactions.push(fullData);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    return fullData;
}

export function getTransactionsFromLocalStorage(): TransactionData[] {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const data = localStorage.getItem('transactions');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading transactions from localStorage:', error);
        return [];
    }
}

export function getTransactionByIdFromLocalStorage(transactionId: string): TransactionData | null {
    const transactions = getTransactionsFromLocalStorage();
    return transactions.find(t => t.transactionId === transactionId) || null;
}

export function deleteTransactionFromLocalStorage(transactionId: string): void {
    if (typeof window === 'undefined') return;

    const transactions = getTransactionsFromLocalStorage();
    const filtered = transactions.filter(t => t.transactionId !== transactionId);
    localStorage.setItem('transactions', JSON.stringify(filtered));
}

export function clearAllTransactionsFromLocalStorage(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('transactions');
}
