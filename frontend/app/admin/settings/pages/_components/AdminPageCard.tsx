import React from 'react';
import {PageType} from "@/lib/db/types";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {RenderDescription} from "@/components/rich-text-editor/RenderDescription";
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {EyeIcon, MoreVerticalIcon, PencilIcon, Trash2Icon} from "lucide-react";
import Link from "next/link";

const AdminPageCard = ({item}:{item:PageType}) => {
    return (
        <Card className={"relative"}>
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"secondary"} size={"icon"}>
                            <MoreVerticalIcon className={"size-4"}/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={"end"} className={"w-48"}>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/settings/pages/${item.id}/edit`}>
                                <PencilIcon className={"size-4 mr-2"}/>
                                Edit Page
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/pages/${item.slug}`}>
                                <EyeIcon className={"size-4 mr-2"}/>
                                Review Page
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/settings/pages/${item.id}/delete`}>
                                <Trash2Icon className={"size-4 mr-2 text-destructive"}/>
                                Delete Page
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <CardHeader>
                <CardTitle>
                    {item.title}
                </CardTitle>

                <Separator className={"my-3"}/>
                <CardDescription className={"line-clamp-3"}>
                    <RenderDescription json={JSON.parse(item.content)}/>
                </CardDescription>
            </CardHeader>
        </Card>
    );
};

export default AdminPageCard;
