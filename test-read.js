
const fs = require('fs');
const path = require('path');

const placeholderPath = path.join(process.cwd(), "public", "placeholder-user.jpg");
console.log("Path:", placeholderPath);

try {
    const start = Date.now();
    const imageBuffer = fs.readFileSync(placeholderPath);
    console.log("Success! Read", imageBuffer.length, "bytes in", Date.now() - start, "ms");
} catch (err) {
    console.error("Failed to read file:", err);
}
