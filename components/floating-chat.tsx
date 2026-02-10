"use client";

import { MessageCircle } from "lucide-react";

export function FloatingChat() {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const whatsappLink = `https://wa.me/${whatsappNumber}`;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        window.open(whatsappLink, '_blank', 'noopener,noreferrer');
    };

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl active:scale-95 cursor-pointer border-none"
            aria-label="Live Chat"
            type="button"
        >
            <MessageCircle className="h-7 w-7" />
        </button>
    );
}
