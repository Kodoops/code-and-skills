
"use server";

import {requireAdmin} from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db/db";
import {ApiResponseType} from "@/lib/db/types";
import {revalidatePath} from "next/cache";
import arcjet from "@/lib/providers/arcjet";
import {fixedWindow, request} from "@arcjet/next";

const aj = arcjet
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function deleteFeature(featureId: string) :Promise<ApiResponseType>{

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

        await prisma.feature.delete({
            where: {
                id: featureId
            },
        })

        revalidatePath(`/admin/features`)

        return{
            status: "success",
            message: "Feature deleted successfully"
        }
    }catch(e) {
        console.log(e)
        return{
            status: "error",
            message: "Failed to delete feature"
        }
    }

}
