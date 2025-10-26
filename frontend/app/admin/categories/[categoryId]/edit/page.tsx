import React from 'react';
import {notFound} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import EditCategoryForm from './_components/EditCategoryForm';
import {adminGetCategoryById} from "@/actions/admin/categories";
import {adminGetAllDomains} from "@/actions/admin/domain";

type Params = Promise<{ categoryId: string }>;

const EditCategoryPage = async ({params}: { params: Params }) => {

    const {categoryId} = await params;
    if (!categoryId) notFound();

    const data = await adminGetCategoryById(categoryId);
    if (!data) notFound();

    const domains = await adminGetAllDomains();

    if(!domains )
        return <div className={"text-destructive text-center p-2"}>Impossible de créer des catégories sans domaines</div>;

    return (
        <div>
            <h1 className={"text-xl font-bold mb-8"}>
                Edit Category : <span className={"text-primary underline"}>{data.title}</span>
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle>Basic Infos</CardTitle>
                    <CardDescription>
                        Provide basic information about the category.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {domains && domains?.length !== 0 && <EditCategoryForm data={data} domains={domains}/>}
                </CardContent>
            </Card>
        </div>
    );
};

export default EditCategoryPage;
