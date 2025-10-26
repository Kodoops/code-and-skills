"use client";

import React, {useMemo} from 'react';
import {generateHTML} from "@tiptap/html";
import {JSONContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import parse from "html-react-parser";
import {cn} from "@/lib/utils";

export function RenderDescription ({json}:{json:JSONContent})  {

    const outPut = useMemo(() => {
        return generateHTML(json, [StarterKit, TextAlign])
    }, [json]);

    return (
        <div className={cn("prose  dark:prose-invert prose-li:marker:text-primary max-w-none w-full")}>
            {parse(outPut)}
        </div>
    );
};

