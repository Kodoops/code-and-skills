import React from 'react';
import {RenderDescription} from "@/components/rich-text-editor/RenderDescription";
import {getPage} from "@/actions/public/page";
import {notFound} from "next/navigation";

type Params = Promise<{ slug: string }>;

const PageLink = async ({params}: { params: Params }) => {

    const {slug} = await params;

    const response = await getPage(slug);
    if (!response || response.status !== "success") return notFound();

    const data = response.data;

    return (
        <div className={"my-6"}>
            <h2 className={"text-4xl font-bold text-center border-b-2 border-border pb-4 mb-6"}>
                {data.title}
            </h2>
            <div className="w-full">
                {data.content && <RenderDescription json={JSON.parse(data.content)}/>}
            </div>
        </div>
    );
};

export default PageLink;
