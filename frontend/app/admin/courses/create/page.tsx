import CreateCoursePage from "./_components/CreateCoursePage";
import {LEVELS, STATUS} from "@/models";
import {getAllCategories} from "@/actions/public/category";
import CardError from "@/components/custom-ui/CardError";
import React from "react";


export default async function CreateCoursePageWrapper() {
    const {data} = await getAllCategories();

    if(!data || data.length === 0)
        return <CardError message={" Aucune Catégorie de trouvée , merci de contacter l'administrateur."} title={"Erreur chargement des catégories"} />

    const categories = data.map(category => ({
        id: category.id,
        title: category.title,
        slug: category.slug,
    }))

    return <CreateCoursePage categories={categories} levels={LEVELS} status={STATUS}/>;
}
