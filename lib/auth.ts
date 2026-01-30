import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        // Telegram provider using Credentials (custom implementation)
        Credentials({
            id: "telegram",
            name: "Telegram",
            credentials: {
                id: { label: "ID", type: "text" },
                first_name: { label: "First Name", type: "text" },
                last_name: { label: "Last Name", type: "text" },
                username: { label: "Username", type: "text" },
                photo_url: { label: "Photo URL", type: "text" },
                auth_date: { label: "Auth Date", type: "text" },
                hash: { label: "Hash", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.id || !credentials?.hash) {
                    return null;
                }

                // Verify Telegram auth hash
                const crypto = await import("crypto");
                const botToken = process.env.TELEGRAM_BOT_TOKEN;

                if (!botToken) {
                    console.error("TELEGRAM_BOT_TOKEN is not set");
                    return null;
                }

                const secretKey = crypto
                    .createHash("sha256")
                    .update(botToken)
                    .digest();

                // Define which keys to include in the check string
                const telegramKeys = ["auth_date", "first_name", "id", "last_name", "photo_url", "username"];

                const dataCheckString = Object.keys(credentials)
                    .filter((key) => telegramKeys.includes(key) && credentials[key as keyof typeof credentials])
                    .sort()
                    .map((key) => `${key}=${credentials[key as keyof typeof credentials]}`)
                    .join("\n");

                const hmac = crypto
                    .createHmac("sha256", secretKey)
                    .update(dataCheckString)
                    .digest("hex");

                if (hmac !== credentials.hash) {
                    console.error("Telegram auth hash verification failed");
                    console.log("Check string was:", dataCheckString);
                    return null;
                }

                // Check auth_date is not too old (1 hour max)
                const authDate = parseInt(credentials.auth_date as string, 10);
                const now = Math.floor(Date.now() / 1000);
                if (now - authDate > 3600) {
                    console.error("Telegram auth date is too old");
                    return null;
                }

                return {
                    id: credentials.id as string,
                    name: `${credentials.first_name || ""} ${credentials.last_name || ""}`.trim() || credentials.username as string,
                    image: credentials.photo_url as string,
                    email: null,
                };
            },
        }),
    ],
    pages: {
        signIn: "/",
        error: "/",
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.provider = account?.provider;
                token.picture = user.image;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.image = token.picture as string;
                (session as any).provider = token.provider;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    trustHost: true,
});
