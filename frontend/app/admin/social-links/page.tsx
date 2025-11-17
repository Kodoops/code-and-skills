import React, {Suspense} from "react";
import EmptyState from "@/components/general/EmptyState";
import {AdminCategoryCardSkeleton} from "@/app/admin/categories/_components/AdminCategoryCard";
import SocialLinkForm from "@/app/admin/social-links/_component/SocialLinkForm";
import {SocialNetworkCard} from "@/app/admin/social-links/_component/SocialNetworkCard";
import {SocialLink} from "@/models";
import {getCompanySocialLinks, getSocialLinksNotLinkedYet} from "@/actions/public/social-networks";


const SocialLinksPage = async () => {

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>Our Social Links</h1>
            </div>
            <Suspense fallback={<AdminCategoryCardSkeletonLayout/>}>
                <RenderSocialLinks/>
            </Suspense>
        </>
    );
}

export default SocialLinksPage;

async function RenderSocialLinks() {

    const existing = await getCompanySocialLinks();
    console.log(existing)
    const links = await getSocialLinksNotLinkedYet();
    const existingIds = existing?.data?.map((link) => link.socialLink.id);

    const availables = links.data?.filter((link) => !existingIds?.includes(link.id));


    return (
        <>
            {existing?.data?.length === 0 ?
                <EmptyState title={"No Social Links Found"}
                            description={"You don't have any social link yet. Add new social link to get started."}
                />
                :
                <>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4">
                        {existing?.data?.map((social) => {

                                const props = {
                                    ...social.socialLink,
                                    url: social.url
                                };

                                // @ts-ignore
                            return <AdminSocialLinkCard key={social.id} social={props}/>
                            }
                        )}
                    </div>
                </>
            }

            {availables && availables.length>0 && <SocialLinkForm links={availables}/>}
        </>
    )
}

function AdminCategoryCardSkeletonLayout() {
    return (
        <div className="">
            {Array.from({length: 4}).map((_, index) => (
                <AdminCategoryCardSkeleton key={index}/>
            ))}
        </div>
    )
}

function AdminSocialLinkCard({social}: { social: SocialLink & { url: string } }) {

    return (
            <SocialNetworkCard item={social}/>
    )
}
