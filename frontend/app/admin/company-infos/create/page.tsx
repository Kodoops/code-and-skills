import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import CreateCompanyInfosForm from "@/app/admin/company-infos/create/_component/CreateCompanyInfosForm";
import {getCompanyInfos} from "@/actions/auth/company";
import CardError from "@/components/custom-ui/CardError";


const CreateCompanyPage = async () => {


    const result = await getCompanyInfos();

    if(!result || result.status!== "success") return <CardError  message={result.message} title={"Erreur chargement des infos de la companie"} />

    const data = result.data;

    return (
        <div>
            <h1 className={"text-xl font-bold mb-8"}>
                Create Company : <span className={"text-primary underline"}>{data?.name}</span>
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle>Basic Infos</CardTitle>
                    <CardDescription>
                        Provide basic information about the category.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {
                       <CreateCompanyInfosForm />
                    }
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateCompanyPage;
