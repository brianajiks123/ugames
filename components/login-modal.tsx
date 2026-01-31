"use client";

import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { TelegramLoginButton } from "./telegram-login-button";

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

      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
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

          <div className="flex flex-col items-center gap-4">
            <Button
              variant="outline"
              className="w-[250px] h-12 justify-center gap-3 border-border bg-secondary hover:bg-secondary/80"
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

            <div className="w-[250px] flex justify-center">
              <TelegramLoginButton
                key={isOpen ? "open" : "closed"}
                botName={process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || ""}
                onAuth={handleTelegramAuth}
              />
            </div>
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
