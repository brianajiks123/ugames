"use client";

import { useEffect, useRef } from "react";

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

interface TelegramLoginButtonProps {
    botName: string;
    onAuth: (user: TelegramUser) => void;
    buttonSize?: "large" | "medium" | "small";
    cornerRadius?: number;
    requestAccess?: string;
    usePic?: boolean;
}

declare global {
    interface Window {
        onTelegramAuth: (user: TelegramUser) => void;
    }
}

export function TelegramLoginButton({
    botName,
    onAuth,
    buttonSize = "large",
    cornerRadius,
    requestAccess = "write",
    usePic = true,
}: TelegramLoginButtonProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Define the global callback
        window.onTelegramAuth = (user: TelegramUser) => {
            onAuth(user);
        };

        // Clean up previous attempts if any
        if (containerRef.current) {
            containerRef.current.innerHTML = "";
        }

        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.setAttribute("data-telegram-login", botName);
        script.setAttribute("data-size", buttonSize);
        if (cornerRadius !== undefined) {
            script.setAttribute("data-radius", cornerRadius.toString());
        }
        script.setAttribute("data-request-access", requestAccess);
        script.setAttribute("data-userpic", usePic.toString());
        script.setAttribute("data-onauth", "onTelegramAuth(user)");
        script.async = true;

        if (containerRef.current) {
            containerRef.current.appendChild(script);
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = "";
            }
        };
    }, [botName, onAuth, buttonSize, cornerRadius, requestAccess, usePic]);

    return (
        <div
            ref={containerRef}
            className="flex justify-center items-center py-1 overflow-hidden min-h-[40px]"
        />
    );
}
