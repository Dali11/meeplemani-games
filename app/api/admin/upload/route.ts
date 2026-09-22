import { randomUUID } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { hasSession } from "@/lib/admin-auth";
import {
    buildObjectKey,
    checkImageFile,
    publicObjectUrl,
} from "@/lib/upload";

export const runtime = "nodejs";

function storageClient() {
    const endpoint = process.env.AWS_ENDPOINT_URL_S3;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.AWS_REGION || "us-east-2";
    const bucket = process.env.STORAGE_BUCKET;

    if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
        return null;
    }

    const client = new S3Client({
        region,
        endpoint,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
        forcePathStyle: true,
    });

    return {
        client,
        endpoint,
        bucket,
    };
}

export async function POST(request: Request) {
    if (!(await hasSession())) {
        return NextResponse.json(
            { error: "Please log in again." },
            { status: 401 },
        );
    }

    const storage = storageClient();

    if (!storage) {
        return NextResponse.json(
            {
                error:
                    "Photo storage is not set up yet. Add the storage keys to the environment variables.",
            },
            { status: 503 },
        );
    }

    const form = await request.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") ?? "uploads");

    if (!(file instanceof File)) {
        return NextResponse.json(
            { error: "No photo was received." },
            { status: 400 },
        );
    }

    const check = checkImageFile({
        type: file.type,
        size: file.size,
    });

    if (check.ok === false) {
        return NextResponse.json(
            { error: check.error },
            { status: 400 },
        );
    }

    const key = buildObjectKey(
        folder,
        file.type,
        randomUUID(),
    );

    const bytes = new Uint8Array(
        await file.arrayBuffer(),
    );

    try {
        await storage.client.send(
            new PutObjectCommand({
                Bucket: storage.bucket,
                Key: key,
                Body: bytes,
                ContentType: file.type,
            }),
        );
    } catch (error) {
        console.error("Photo upload failed", error);

        return NextResponse.json(
            {
                error:
                    "The upload failed. Please try again.",
            },
            { status: 502 },
        );
    }

    const url = publicObjectUrl(
        storage.endpoint,
        storage.bucket,
        key,
    );

    return NextResponse.json({ url });
}