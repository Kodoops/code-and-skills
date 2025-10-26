import {z} from "zod";
import {NextResponse} from "next/server";
import {PutObjectCommand} from "@aws-sdk/client-s3";
import {v4 as uuidv4} from 'uuid'
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {S3} from "@/lib/providers/S3Client";
import {env} from "@/lib/env";
import arcjet from "@/lib/providers/arcjet";
import { fixedWindow} from "@arcjet/next";
import {requireAdmin} from "@/actions/admin/requireAdmin";

export const fileUploadSchema = z.object({
    fileName: z.string().min(1, {message: "File name is required"}),
    contentType: z.string().min(1, {message: "Content type is required"}),
    size: z.number().min(1, {message: "File size is required"}),
    isImage: z.boolean(),
});

const aj = arcjet
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5,
        })
    );

export async function POST(request: Request) {
   const user = await requireAdmin();

    try {
        const decision = await aj.protect(request,{fingerprint: user.email as string} );

        if(decision.isDenied()){
            return NextResponse.json(
                {error: "Too many requests. Please try again in a minute"},
                {status: 429}
            )
        }
        const body = await request.json();

        const validation = fileUploadSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {error: 'Invalid Request Body'},
                {status: 400}
            );
        }
        const {fileName, contentType, size} = validation.data;

        const uniqueKey = `${uuidv4()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            ContentType: contentType,
            ContentLength: size,
            Key: uniqueKey,
        });

        const presignedUrl = await getSignedUrl(S3, command, {expiresIn: 360}) // URL Expires in 6 minutes
        const response = {
            url: presignedUrl,
            key: uniqueKey
        }
        return NextResponse.json(response);

    } catch (e) {
        console.log(e)
        return NextResponse.json(
            {error: "Failed to generate presigned URL for upload"},
            {status: 500}
        )
    }
}
