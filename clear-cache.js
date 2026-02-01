const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '.next');
if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true });
}

const cacheDir = path.join(__dirname, 'node_modules', '.cache');
if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
}

const turbopackDir = path.join(__dirname, '.turbo');
if (fs.existsSync(turbopackDir)) {
    fs.rmSync(turbopackDir, { recursive: true, force: true });
}

const cacheDirs = [
    path.join(__dirname, 'node_modules', '.vite'),
    path.join(__dirname, 'node_modules', '.turbo'),
    path.join(__dirname, '.swc'),
];

cacheDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});
