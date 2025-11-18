
import {ArrowLeft} from 'lucide-react';
import Link from 'next/link';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { buttonVariants} from "@/components/ui/button";

import EditFormPage from "@/app/admin/pages/[id]/edit/_component/EditFormPage";
import {getPage} from "@/actions/admin/page";
import CardError from "@/components/custom-ui/CardError";

const EditPagePage =  async ({params}: { params: Promise<{ id: string }> }) => {
    const {id} = await params

    const response = await getPage(id);

    if(!response || response.status !== "success") return
        <CardError message={response.message} title={"Erreur chargement de la page"} />;

    return (
        <>
            <div className="flex items-center gap-4">
                <Link href={"/admin/pages"} className={buttonVariants({variant: "outline", size: "icon"})}>
                    <ArrowLeft className={"size-4"}/>
                </Link>
                <h1 className={"text-2xl font-bol"}>Edit Page</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Basic Information
                    </CardTitle>
                    <CardDescription>
                        Provide basic information about page
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EditFormPage  data={response.data} id={id}/>
                </CardContent>
            </Card>
        </>
    );
};

export default EditPagePage;
