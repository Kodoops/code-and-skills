"use client"

import React, {useMemo} from 'react';
import {EditorContent, JSONContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Menubar from "@/components/rich-text-editor/Menubar";
import TextAlign from "@tiptap/extension-text-align";
import {ControllerRenderProps, FieldValues, Path} from "react-hook-form";


const DEFAULT_HTML = '<p>Your content here !</p>';

function toTiptapContent(raw: unknown) {
    if (raw == null) return DEFAULT_HTML;

    if (typeof raw === 'string') {
        const str = raw.trim();
        if (!str) return DEFAULT_HTML;

        // essaie JSON d’abord
        if (str.startsWith('{') || str.startsWith('[')) {
            try {
                return JSON.parse(str); // Tiptap accepte un doc JSON
            } catch {
                // pas du JSON valide, on tente comme HTML
            }
        }
        // sinon traite comme HTML
        return str;
    }

    // déjà un objet (doc JSON)
    if (typeof raw === 'object') return raw as JSONContent;

    return DEFAULT_HTML;
}

type RichTextEditorProps<T extends FieldValues, N extends Path<T>> = {
    field: ControllerRenderProps<T, N>;
};
//const RichTextEditor = ({field}: { field: any }) => {
export default function RichTextEditor<T extends FieldValues, N extends Path<T>>(
    { field }: RichTextEditorProps<T, N>
) {
    const content = useMemo(() => toTiptapContent(field.value), [field.value]);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            })
        ],
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none'
            }
        },
        onUpdate: ({editor}) => {
            field.onChange(JSON.stringify(editor.getJSON()))
        },
        onCreate: ({ editor }) => {
            // si le form est vide, on initialise aussi la valeur du form
            if (!field.value) {
                field.onChange(JSON.stringify(editor.getJSON()));
            }
        },
        content: content
    });

    return (
        <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
            <Menubar editor={editor}/>
            <EditorContent editor={editor}/>
        </div>
    );
};

