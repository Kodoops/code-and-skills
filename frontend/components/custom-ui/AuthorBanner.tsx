import React from 'react';
import UserSVG from "@/components/custom-ui/UserSVG";
import {RatingStars} from "@/components/custom-ui/RatingStars";
import Image from "next/image";

interface Props {
    name: string;
    title?: string;
    description?: string;
    rating?: number;
    avatar?: string;
}

const AuthorBanner = ({name, title,description, rating, avatar  }:Props) => {
    return (
        <div className="border rounded-lg p-4 bg-muted-foreground/10 flex items-center gap-6 ">
            {avatar ?
                <div  className=" bg-muted-foreground/10 rounded-full border-2 p-0.5 ">
                    <Image src={avatar} alt={"avatar" + name} width={64} height={64} className="rounded-full  "/>
                </div>
                : <UserSVG/>}
            <div className="">
                <p className={"font-semibold text-primary"}>{name}
                    {title && <span className={"text-sm italic text-muted-foreground"}> - {title}</span>}
                </p>
                {description && <p className={"text-sm italic text-muted-foreground"}>{description}</p>}
                {rating && <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <RatingStars rating={rating}/> <span className={"text-xs"}>({rating})</span>
                </div>}
            </div>
        </div>
    );
};

export default AuthorBanner;
