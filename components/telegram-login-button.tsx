"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TelegramUser } from "@/lib/telegram";
import { Loader2 } from "lucide-react";

interface TelegramLoginButtonProps {
    botName: string;
    onAuth: (user: TelegramUser) => void;
}

declare global {
    interface Window {
        Telegram: {
            Login: {
                auth: (options: any, callback: (user: TelegramUser) => void) => void;
            };
        };
    }
}

export function TelegramLoginButton({
    botName,
    onAuth,
}: TelegramLoginButtonProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (window.Telegram?.Login) {
            setIsLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.onload = () => setIsLoaded(true);
        document.head.appendChild(script);
    }, []);

    const handleLogin = () => {
        if (!window.Telegram?.Login) return;

        setIsLoading(true);
        window.Telegram.Login.auth(
            { bot_id: botName, request_access: "write" },
            (user) => {
                setIsLoading(false);
                if (user) {
                    onAuth(user);
                }
            }
        );
    };

    return (
        <Button
            variant="outline"
            className="w-[250px] h-12 justify-center gap-3 border-none bg-[#24A1DE] hover:bg-[#24A1DE]/90 text-white"
            onClick={handleLogin}
            disabled={!isLoaded || isLoading}
        >
            {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <>
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.11-.31-1.07-.66.02-.18.27-.36.75-.55 2.93-1.27 4.88-2.11 5.85-2.52 2.79-1.16 3.37-1.36 3.75-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .33z" />
                    </svg>
                    <span>Log in with Telegram</span>
                </>
            )}
        </Button>
    );
}
