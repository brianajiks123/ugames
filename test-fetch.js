
const url = "https://t.me/i/userpic/320/j65NdeOt8y1TEfxdxnMwSlFv_sEHNh4Dcnb8tvilu5l.jpg";

async function test() {
    console.log("Fetching:", url);
    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });
        console.log("Status:", res.status);
        console.log("Redirected:", res.redirected);
        console.log("Final URL:", res.url);
        if (!res.ok) {
            console.log("Body:", await res.text());
        }
    } catch (e) {
        console.error(e);
    }
}

test();
