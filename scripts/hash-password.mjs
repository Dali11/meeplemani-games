// Usage: node scripts/hash-password.mjs "a long password you will remember"
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];

if (!password || password.length < 12) {
    console.error(
        'Please give a password of at least 12 characters, in quotes:\n  node scripts/hash-password.mjs "your password here"',
    );
    process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");

console.log("\nAdd this line to .env.local (and to Vercel):\n");
console.log(`ADMIN_PASSWORD_HASH="${salt}:${hash}"\n`);