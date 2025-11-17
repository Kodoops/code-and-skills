import React from 'react';
import {Card} from "@/components/ui/card";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { requireUser } from '@/actions/auth/requireUser';
import NewsLetterForm from "@/components/sections/NewsLetterForm";
import {getNewsletterSubscription} from "@/actions/auth/newsletter";
import {redirect} from "next/navigation";

const MyNewsLetterPage = async () => {

    const user = await requireUser();
    if(!user) return redirect("/login");

    let newsletter = null;

    const response = await getNewsletterSubscription(user?.email);

    if(response && response.data)
        newsletter = response.data;


    if(!newsletter) return (
        <div>
           <div className="flex items-center justify-center h-24">
              <p className={"text-center text-muted-foreground text-lg"}>
                  You are not subscribed to our newsletter.
              </p>
           </div>

           <Card className="m-6">
               <h2 className={"text-xl text-center my-6"}>Inscription à la Newsletter </h2>
               <NewsLetterForm  />
           </Card>
        </div>
    )

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="flex items-center justify-center p-6">
                <div className="">
                    <p className={"text-center text-muted-foreground text-lg"}>
                        You are subscribed to our newsletter.
                    </p>
                    <p className={"text-center text-muted-foreground text-lg"}>
                        You will receive an email every time we publish a new article.
                    </p>
                       <div className=" flex items-center justify-center mt-6 ">
                           <Link href={"/dashboard/my-newsletter/unsubscribe?email=" + user.email}
                                 className={cn(buttonVariants())}>
                               Unsubscribe
                           </Link>
                       </div>
                </div>
            </div>

        </div>
    );
};

export default MyNewsLetterPage;
