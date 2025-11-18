"use client";

import React, {useMemo} from 'react';
import {generateHTML} from "@tiptap/html";
import {JSONContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import parse from "html-react-parser";
import {cn} from "@/lib/utils";

export function RenderDescription ({json, maxLength}:{json:JSONContent, maxLength?:number})  {

    const fullHtml = useMemo(() => {
        return generateHTML(json, [StarterKit, TextAlign])
    }, [json]);


    // 2️⃣ Extract only text content
    function stripHtml(html: string): string {
        if (!html) return "";
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    // 3️⃣ Cut text
    const truncatedText = useMemo(() => {
        const text = stripHtml(fullHtml);
        if (maxLength && text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "…";
    }, [fullHtml, maxLength]);
    if(maxLength){

        // 4️⃣ Re-wrap inside a normal <p> so layout stays nice
        const rendered = `<p>${truncatedText}</p>`;
    }

    // 4️⃣ Re-wrap inside a normal <p> so layout stays nice
    const rendered = `${truncatedText}`;

    return (
        <div className={cn("prose  dark:prose-invert prose-li:marker:text-primary max-w-none w-full")}>
            {maxLength ? rendered :parse(fullHtml)}
        </div>
    );
};

