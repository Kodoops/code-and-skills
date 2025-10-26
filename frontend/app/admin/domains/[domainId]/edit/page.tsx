import React from 'react';
import {notFound} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import EditDomainForm from './_components/EditDomainForm';
import {adminGetDomainById} from "@/actions/admin/domain";

type Params = Promise<{ domainId: string }>;

const EditDomainPage = async ({params}: { params: Params }) => {

    const {domainId} = await params;
    if (!domainId) notFound();

    const data = await adminGetDomainById(domainId);
    if (!data) notFound();

    return (
        <div>
            <h1 className={"text-xl font-bold mb-8"}>
                Edit Domain : <span className={"text-primary underline"}>{data.title}</span>
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle>Basic Infos</CardTitle>
                    <CardDescription>
                        Provide basic information about the domain.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EditDomainForm data={data}/>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditDomainPage;
