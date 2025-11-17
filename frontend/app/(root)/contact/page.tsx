import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Mail, Phone, MapPin} from "lucide-react";
import ContactForm from "@/app/(root)/contact/_component/ContactForm";
import {getCompanyInfos} from "@/actions/public/company";
import {Skeleton} from "@/components/ui/skeleton";
import {Suspense} from "react";

export default async function ContactPage() {


    return (
        <div className="container mx-auto px-6 py-12 space-y-12">

            <div className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-4xl font-bold">Contactez-nous</h1>
                <p className="text-muted-foreground">
                    Une question ? Un projet ? Remplissez le formulaire ci-dessous ou
                    contactez-nous directement.
                </p>
            </div>


            <Suspense fallback={<CompanyInfosSkeleton/>}>
                <RenderCompanyInfos/>
            </Suspense>

            {/* Formulaire */}
            <Card className={"max-w-2xl mx-auto space-y-4 px-6"}>
                <CardHeader>
                    <CardTitle className={"text-xl text-center "}>Envoyez-nous un message</CardTitle>
                </CardHeader>
                <CardContent>
                    <ContactForm/>
                </CardContent>
            </Card>
        </div>
    );
}

const RenderCompanyInfos = async () => {
    const res = await getCompanyInfos();
    let company = null
    if (res && res.status === "success")
        company = res.data;

    return (
        company && <div className="space-y-6">
            <Card className={"max-w-2xl mx-auto space-y-4 px-6"}>
                <CardHeader>
                    <CardTitle>Nos coordonnées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="flex items-center gap-2">
                        <MapPin className="text-primary w-5 h-5"/>
                        {company.address}
                    </p> <p className="flex items-center gap-2 pl-8">
                    {company.postalCode} {company.city} - {company.country.toUpperCase()}
                </p>
                    <p className="flex items-center gap-2">
                        <Mail className="text-primary w-5 h-5"/>
                        {company.email}
                    </p>
                    <p className="flex items-center gap-2">
                        <Phone className="text-primary w-5 h-5"/>
                        {company.phone}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

function CompanyInfosSkeleton() {
    return (
        <div className="space-y-6">
            <Card className={"max-w-2xl mx-auto space-y-4 px-6"}>
                <CardHeader>
                    <CardTitle>Nos coordonnées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                        <MapPin className="text-primary w-5 h-5"/>
                        <Skeleton className={"w-48 h-6 rounded-md bg-foreground/10"}/>
                    </div>
                    <div className="flex items-center gap-2 pl-8">
                    <Skeleton className={"w-72 h-6 rounded-md bg-foreground/10"}/>
                </div>
                    <div className="flex items-center gap-2 ">
                        <Mail className="text-primary w-5 h-5"/>
                        <Skeleton className={"w-32 h-6 rounded-md bg-foreground/10"}/>
                    </div>
                    <div     className="flex items-center gap-2">
                        <Phone className="text-primary w-5 h-5"/>
                        <Skeleton className={"w-32 h-6 rounded-md bg-foreground/10"}/>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}