
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { buttonVariants} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import {notFound} from "next/navigation";
import Link from "next/link";
import {cn} from "@/lib/utils";
import { adminGetPage } from '@/app/data/admin/admin-get-page';
import EditPageForm from "@/app/admin/settings/pages/[pageId]/edit/_components/EditPageForm";

type Params = Promise<{ pageId: string }>;

const EditAdminLinkPage = async ({params}: { params: Params }) => {

    const {pageId} = await params;
    if (!pageId) notFound();

    const data = await adminGetPage(pageId);
    if (!data) notFound();

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Edit Page
                </CardTitle>
                <CardDescription>
                    Provide basic information about page.
                </CardDescription>
                <Link href={"/admin/settings/pages"} className={cn(buttonVariants({variant: "default"}), "w-48")}>
                    <ArrowLeft className={"size-4"}/> Back to pages
                </Link>
            </CardHeader>
            <CardContent>
                <EditPageForm data={data}/>
            </CardContent>
        </Card>
    );
};

export default EditAdminLinkPage;
