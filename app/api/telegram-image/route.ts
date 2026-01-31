import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");
    const backupUrl = searchParams.get("url");
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!userId || !botToken) {
        return new NextResponse("Missing parameters", { status: 400 });
    }

    try {
        console.log(`[Telegram Proxy] Request for ID: ${userId}, Backup URL: ${backupUrl}`);
        let imageUrl: string | null = null;

        // 1. Try to get user profile photos via Bot API
        try {
            const photosResponse = await fetch(
                `https://api.telegram.org/bot${botToken}/getUserProfilePhotos?user_id=${userId}&limit=1`
            );
            const photosData = await photosResponse.json();

            console.log(`[Telegram Proxy] Bot API Response:`, JSON.stringify(photosData));

            if (photosData.ok && photosData.result.total_count > 0) {
                const fileId = photosData.result.photos[0][0].file_id;
                const fileResponse = await fetch(
                    `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
                );
                const fileData = await fileResponse.json();
                console.log(`[Telegram Proxy] File API Response:`, JSON.stringify(fileData));

                if (fileData.ok) {
                    imageUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
                    console.log(`[Telegram Proxy] Found Image URL via Bot API: ${imageUrl}`);
                }
            } else {
                console.log(`[Telegram Proxy] No photos found via Bot API.`);
            }
        } catch (e) {
            console.error("[Telegram Proxy] Bot API fetch failed:", e);
        }

        // 2. Fallback to backup URL if Bot API failed
        if (!imageUrl && backupUrl) {
            console.log(`[Telegram Proxy] Falling back to provided URL: ${backupUrl}`);
            imageUrl = backupUrl;
        }

        if (!imageUrl) {
            console.error("[Telegram Proxy] No image URL available.");
            return new NextResponse("Profile photo not found", { status: 404 });
        }

        // 3. Fetch the actual file
        console.log(`[Telegram Proxy] Fetching image content from: ${imageUrl}`);
        const imageResponse = await fetch(imageUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });

        if (!imageResponse.ok) {
            console.error(`[Telegram Proxy] Upstream fetch failed with status: ${imageResponse.status}`);
            return new NextResponse("Failed to fetch image from upstream", { status: imageResponse.status });
        }

        const imageBuffer = await imageResponse.arrayBuffer();
        const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
        console.log(`[Telegram Proxy] Successfully retrieved image. Content-Type: ${contentType}`);

        return new NextResponse(imageBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400, s-maxage=86400", // Cache for 24 hours
            },
        });
    } catch (error) {
        console.error("Telegram image proxy error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
