import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!userId || !botToken) {
        return new NextResponse("Missing parameters", { status: 400 });
    }

    try {
        const photosResponse = await fetch(
            `https://api.telegram.org/bot${botToken}/getUserProfilePhotos?user_id=${userId}&limit=1`
        );
        const photosData = await photosResponse.json();

        if (!photosData.ok || photosData.result.total_count === 0) {
            return new NextResponse("Profile photo not found", { status: 404 });
        }

        const fileId = photosData.result.photos[0][0].file_id;
        const fileResponse = await fetch(
            `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
        );
        const fileData = await fileResponse.json();

        if (!fileData.ok) {
            return new NextResponse("File path not found", { status: 404 });
        }

        const imageUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();

        const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
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
