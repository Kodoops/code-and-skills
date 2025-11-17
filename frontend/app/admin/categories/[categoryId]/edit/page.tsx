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

    const response = await adminGetCategoryById(categoryId);
    if (!response) notFound();

    const result = await adminGetAllDomains();

    if(!result || result.data?.length === 0 )
        return <div className={"text-destructive text-center p-2"}>Impossible de créer des catégories sans domaines</div>;

    return (
        <div>
            <h1 className={"text-xl font-bold mb-8"}>
                Edit Category : <span className={"text-primary underline"}>{response.data.title}</span>
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle>Basic Infos</CardTitle>
                    <CardDescription>
                        Provide basic information about the category.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {result.data && result.data?.length !== 0 && <EditCategoryForm data={response.data} domains={result.data}/>}
                </CardContent>
            </Card>
        </div>
    );
};

export default EditCategoryPage;
