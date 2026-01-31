import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");
    const backupUrl = searchParams.get("url");
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    const servePlaceholder = () => {
        try {
            const placeholderPath = path.join(process.cwd(), "public", "placeholder-user.jpg");
            const imageBuffer = fs.readFileSync(placeholderPath);
            return new NextResponse(imageBuffer, {
                headers: {
                    "Content-Type": "image/jpeg",
                    "Cache-Control": "public, max-age=86400, s-maxage=86400",
                },
            });
        } catch (err) {
            console.error("[Telegram Proxy] Failed to serve placeholder:", err);
            return new NextResponse("Profile photo not found and placeholder missing", { status: 404 });
        }
    };

    if (!userId || !botToken) {
        return new NextResponse("Missing parameters", { status: 400 });
    }

    try {
        let imageUrl: string | null = null;

        try {
            const photosResponse = await fetch(
                `https://api.telegram.org/bot${botToken}/getUserProfilePhotos?user_id=${userId}&limit=1`
            );
            const photosData = await photosResponse.json();

            if (photosData.ok && photosData.result.total_count > 0) {
                const fileId = photosData.result.photos[0][0].file_id;
                const fileResponse = await fetch(
                    `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
                );
                const fileData = await fileResponse.json();

                if (fileData.ok) {
                    imageUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
                }
            }
        } catch (e) {
            console.error("[Telegram Proxy] Bot API fetch failed:", e);
        }

        if (!imageUrl && backupUrl) {
            imageUrl = backupUrl;
        }

        if (!imageUrl) {
            console.log("[Telegram Proxy] No image URL found, serving placeholder.");
            return servePlaceholder();
        }

        const imageResponse = await fetch(imageUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });

        if (!imageResponse.ok) {
            console.warn(`[Telegram Proxy] Upstream fetch failed (${imageResponse.status}), serving placeholder.`);
            return servePlaceholder();
        }

        const imageBuffer = await imageResponse.arrayBuffer();
        const contentType = imageResponse.headers.get("content-type") || "image/jpeg";

        return new NextResponse(imageBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400, s-maxage=86400",
            },
        });
    } catch (error) {
        console.error("Telegram image proxy error:", error);
        return servePlaceholder();
    }
}
