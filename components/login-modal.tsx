"use client";

import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

declare global {
  interface Window {
    TelegramLoginWidget?: {
      dataOnauth: (user: TelegramUser) => void;
    };
  }
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isTelegramLoading, setIsTelegramLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTelegramAuth = useCallback(
    async (user: TelegramUser) => {
      setIsTelegramLoading(true);
      setError(null);

      try {
        const result = await signIn("telegram", {
          id: user.id.toString(),
          first_name: user.first_name,
          last_name: user.last_name || "",
          username: user.username || "",
          photo_url: user.photo_url || "",
          auth_date: user.auth_date.toString(),
          hash: user.hash,
          redirect: false,
        });

        if (result?.error) {
          setError("Login Telegram gagal. Silakan coba lagi.");
        } else {
          onClose();
          window.location.reload();
        }
      } catch {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      } finally {
        setIsTelegramLoading(false);
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      window.TelegramLoginWidget = {
        dataOnauth: handleTelegramAuth,
      };
    }
  }, [isOpen, handleTelegramAuth]);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      await signIn("google", { callbackUrl: "/" });
    } catch {
      setError("Login Google gagal. Silakan coba lagi.");
      setIsGoogleLoading(false);
    }
  };

  const handleTelegramClick = () => {
    const botId = process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID;

    if (!botId) {
      setError("Telegram belum dikonfigurasi (Bot ID missing).");
      return;
    }

    // Open Telegram auth in popup
    const width = 550;
    const height = 470;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent(window.location.origin)}&embed=1&request_access=write&return_to=${encodeURIComponent(window.location.href)}`;

    const popup = window.open(
      authUrl,
      "telegram_auth",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      setError("Popup diblokir. Silakan izinkan popup untuk login.");
      return;
    }

    setIsTelegramLoading(true);

    // Listen for message from popup
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin === "https://oauth.telegram.org") {
        const user = event.data as TelegramUser;
        if (user && user.id) {
          await handleTelegramAuth(user);
        }
        popup.close();
      }
    };

    window.addEventListener("message", handleMessage);

    // Check if popup closed
    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
        window.removeEventListener("message", handleMessage);
        setIsTelegramLoading(false);
      }
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />
      <div className="relative w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Login</h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="mb-6 text-sm text-muted-foreground">
            Pilih metode login untuk melanjutkan
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-12 justify-start gap-3 border-border bg-secondary hover:bg-secondary/80"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isTelegramLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span className="text-foreground">Login dengan Google</span>
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 justify-start gap-3 border-border bg-secondary hover:bg-secondary/80"
              onClick={handleTelegramClick}
              disabled={isGoogleLoading || isTelegramLoading}
            >
              {isTelegramLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#0088cc">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.057-.692-1.654-1.124-2.68-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.44-.751-.245-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.12.099.153.231.168.326.015.095.034.311.019.477z" />
                </svg>
              )}
              <span className="text-foreground">Login dengan Telegram</span>
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Dengan login, kamu menyetujui{" "}
            <span className="text-primary cursor-pointer hover:underline">
              Syarat & Ketentuan
            </span>{" "}
            kami
          </p>
        </div>
      </div>
    </div>
  );
}
