import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
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

                const crypto = await import("crypto");
                const botToken = process.env.TELEGRAM_BOT_TOKEN;

                if (!botToken) {
                    console.error("TELEGRAM_BOT_TOKEN is not set");
                    return null;
                }

                const { hash, ...data } = credentials;

                const telegramFields = ["id", "first_name", "last_name", "username", "photo_url", "auth_date"];
                const dataCheckArr = Object.keys(data)
                    .filter(key => telegramFields.includes(key) && data[key as keyof typeof data])
                    .sort()
                    .map(key => `${key}=${data[key as keyof typeof data]}`);

                const dataCheckString = dataCheckArr.join("\n");

                const secretKey = crypto
                    .createHash("sha256")
                    .update(botToken)
                    .digest();

                const hmac = crypto
                    .createHmac("sha256", secretKey)
                    .update(dataCheckString)
                    .digest("hex");

                if (hmac !== hash) {
                    console.error("Telegram auth hash verification failed");
                    console.log("Expected HMAC:", hmac);
                    console.log("Received Hash:", hash);
                    console.log("Data check string:", dataCheckString);
                    return null;
                }

                const authDate = parseInt(data.auth_date as string, 10);
                const now = Math.floor(Date.now() / 1000);
                if (now - authDate > 86400) { // 24 hours
                    console.error("Telegram auth session expired");
                    return null;
                }

                return {
                    id: data.id as string,
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || (data.username as string),
                    image: `/api/telegram-image?id=${data.id}&url=${encodeURIComponent((data.photo_url as string) || "")}`,
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
