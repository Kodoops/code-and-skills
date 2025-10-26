
import {newsletterSchema, NewsletterSchema} from "@/lib/db/zodSchemas";
import { ResponseType} from "@/models";
import {handleAxiosError} from "@/lib/handleAxiosError";

export async function subscribeToNewsletter(values: NewsletterSchema): Promise<ResponseType< null>> {
    const parsed = newsletterSchema.safeParse(values);

    if (!parsed.success) {
        return { status: "error", message: "Email invalide", data: null };
    }

    try {
        // const existing = await prisma.newsletterSubscription.findUnique({
        //     where: { email: parsed.data.email },
        // });
        //
        // if (existing) {
        //     return { status: "error", message: "Cet email est déjà inscrit." };
        // }
        //
        // await prisma.newsletterSubscription.create({
        //     data: { ...parsed.data},
        // });

        return { status: "success", message: "Inscription réussie !" , data: null};
    } catch (error) {
        return handleAxiosError<null>(error, "Erreur lors de la souscription a la newsletter ");
    }
}
