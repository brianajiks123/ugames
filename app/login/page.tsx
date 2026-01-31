"use client";

import { signIn } from "next-auth/react";
import { useEffect, useRef } from "react";
import { TelegramUser } from "@/lib/telegram";

export default function LoginPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.onTelegramAuth = (user: TelegramUser) => {
            console.log("Telegram auth user:", user);
            signIn("telegram", {
                ...user,
                redirect: true,
                callbackUrl: "/",
            });
        };

        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.setAttribute("data-telegram-login", process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "");
        script.setAttribute("data-size", "large");
        script.setAttribute("data-onauth", "onTelegramAuth(user)");
        script.setAttribute("data-request-access", "write");
        script.async = true;

        if (containerRef.current) {
            containerRef.current.appendChild(script);
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = "";
            }
            delete (window as any).onTelegramAuth;
        };
    }, []);

    return (
        <main className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl text-center space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight">Login dengan Telegram</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        Masuk dengan aman menggunakan akun Telegram Anda
                    </p>
                </div>

                <div className="py-8 flex justify-center">
                    <div ref={containerRef} className="min-h-[40px] flex items-center justify-center">
                        <div className="animate-pulse text-zinc-400">Loading Telegram Widget...</div>
                    </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs text-zinc-400">
                        Kami tidak akan pernah membagikan data Anda tanpa izin.
                    </p>
                </div>
            </div>
        </main>
    );
}
