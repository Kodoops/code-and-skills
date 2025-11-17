"use server";

import {pageLinkSchema, PageLinkSchema} from "@/lib/db/zodSchemas";
import {prisma} from "@/lib/db/db";
import {ApiResponseType} from "@/lib/db/types";
import {requireAdmin} from "@/app/data/admin/require-admin";
import arcjet from "@/lib/providers/arcjet";
import { fixedWindow, request} from "@arcjet/next";

const aj = arcjet

    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function createPageLink(values: PageLinkSchema): Promise<ApiResponseType> {

    const session = await requireAdmin();

    try {
        const req = await request();
        const decision = await aj.protect(req, {fingerprint: session?.user.id as string});

        if (decision.isDenied()) {
            if(decision.reason.isRateLimit()){
                return {
                    status: 'error',
                    message: "Looks like you are making too many requests. Please try again in a minute",
                }
            }else{
                return {
                    status: 'error',
                    message: "you are a bot! , if you are human please try again in a minute or contact support",
                }
            }
        }

        const validation = pageLinkSchema.safeParse(values);
        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }

        const page = await prisma.page.findFirst({
            where: {
                OR: [
                    { slug: validation.data.slug },
                    { title: validation.data.title },
                ],
            },
            select:{
                id:true
            }
        })

        if(page){
            return {
                status: "error",
                message: "Page  already exists"
            }
        }

        await prisma.page.create({
            data: {
                ...validation.data,
            },

        });

        return {
            status: "success",
            message: "Page created successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to create page"
        };
    }

}
