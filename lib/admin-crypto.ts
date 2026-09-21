import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";

/** Checks a typed password against a stored "salt:hash" made by scripts/hash-password.mjs */
export function checkPassword(input: string, stored: string | undefined): boolean {
    const [salt, hash] = (stored ?? "").split(":");
    if (!salt || !hash) return false;

    const expected = Buffer.from(hash, "hex");
    if (expected.length === 0) return false;

    const actual = scryptSync(input, salt, expected.length);
    return timingSafeEqual(actual, expected);
}

function sign(value: string, secret: string) {
    return createHmac("sha256", secret).update(value).digest("base64url");
}

/** Makes a signed token that says "this browser is logged in until <expiry>" */
export function makeToken(secret: string, lifetimeSeconds: number, now = Date.now()) {
    const expires = String(now + lifetimeSeconds * 1000);
    return `${expires}.${sign(expires, secret)}`;
}

/** True only for an untampered token that has not expired */
export function checkToken(token: string | undefined, secret: string | undefined, now = Date.now()) {
    if (!token || !secret || secret.length < 32) return false;

    const [expires, signature] = token.split(".");
    if (!expires || !signature) return false;

    const expiresAt = Number(expires);
    if (!Number.isFinite(expiresAt) || expiresAt < now) return false;

    const expected = Buffer.from(sign(expires, secret));
    const given = Buffer.from(signature);
    return given.length === expected.length && timingSafeEqual(given, expected);
}