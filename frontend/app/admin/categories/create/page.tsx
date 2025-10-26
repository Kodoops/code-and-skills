import CreateCategoryForm from "@/app/admin/categories/create/_component/CreateCategoryForm";
import {adminGetAllDomains} from "@/actions/admin/domain";
import React from "react";


const CreateCategoryPage = async () => {

    const {data:domains} = await adminGetAllDomains();

    if (!domains) {
        return <div className="text-red-500">❌ Impossible de crféer des catégoris sans domaines.</div>;
    }

    return (
        <CreateCategoryForm domains={domains}/>
    )
};

export default CreateCategoryPage;
