import {CompanySocialLink} from "@/models";

export async function getCompanySocialLinks() : Promise<CompanySocialLink [] > {


    return  [];
}



/*
const links: ({
    companySocialLink: ({
        socialLink: {
            id: string
            createdAt: Date
            updatedAt: Date
            name: string
            iconLib: string
            iconName: string
        }
    } & {
        id: string
        createdAt: Date
        updatedAt: Date
        url: string
        companyId: string
        socialLinkId: string
    })[]
} & {
    id: string
    createdAt: Date
    updatedAt: Date
    email: string
    name: string
    address: string
    postalCode: string
    city: string
    country: string
    phone: string | null
    siret: string | null
    vatNumber: string | null
    logoUrl: string | null
    }
) | null
*/