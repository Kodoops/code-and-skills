'use client';

import React, { useEffect, useState, useCallback } from 'react';
import type { Editor } from '@tiptap/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Toggle } from '@/components/ui/toggle';
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Italic,
    ListIcon,
    ListOrdered, RedoIcon,
    Strikethrough, UndoIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {Button} from "@/components/ui/button";

interface Props {
    editor: Editor | null;
}

const Menubar: React.FC<Props> = ({ editor }) => {
    const [, forceUpdate] = useState(0);

    // Toujours appelé; on n'abonne que si editor est défini
    useEffect(() => {
        if (!editor) return;
        const rerender = () => forceUpdate(x => x + 1);
        editor.on('selectionUpdate', rerender);
        editor.on('transaction', rerender);
        editor.on('update', rerender);
        return () => {
            editor.off('selectionUpdate', rerender);
            editor.off('transaction', rerender);
            editor.off('update', rerender);
        };
    }, [editor]);

    // Callbacks toujours définis; on garde les guards internes
    const toggleBold = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().toggleBold().run();
    }, [editor]);

    const toggleItalic = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().toggleItalic().run();
    }, [editor]);

    const toggleStrike = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().toggleStrike().run();
    }, [editor]);


    // Toggle heading générique
    const toggleHeading = useCallback(
        (level: 1 | 2 | 3 | 4 | 5 | 6) => {
            if (!editor) return;
            editor.chain().focus().toggleHeading({ level }).run();
        },
        [editor]
    );

    const toggleBulletList = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().toggleBulletList().run();
    }, [editor]);

    const toggleOrderedList = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().toggleOrderedList().run();
    }, [editor]);

    // États safe quand editor est null
    const isBold = editor ? editor.isActive('bold') : false;
    const isItalic = editor ? editor.isActive('italic') : false;
    const isStrike = editor ? editor.isActive('strike') : false;
    const isBulletList = editor ? editor.isActive('bulletList') : false;
    const isOrderedList = editor ? editor.isActive('orderedList') : false;

    const canBold = editor ? editor.can().chain().focus().toggleBold().run() : false;
    const canItalic = editor ? editor.can().chain().focus().toggleItalic().run() : false;
    const canStrike = editor ? editor.can().chain().focus().toggleStrike().run() : false;
    const canBulletList = editor ? editor.can().chain().focus().toggleBulletList().run() : false;
    const canOrderedList = editor ? editor.can().chain().focus().toggleOrderedList().run() : false;

    // Utils pour headings
    const headingLevels = [1, 2, 3, 4, 5, 6] as const;
    const isHeadingActive = (level: (typeof headingLevels)[number]) =>
        editor ? editor.isActive('heading', { level }) : false;
    const canToggleHeading = (level: (typeof headingLevels)[number]) =>
        editor ? editor.can().chain().focus().toggleHeading({ level }).run() : false;

    return (
        <div className="border border-input border-t-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap items-center gap-1">
            <TooltipProvider>
                {/* Bold */}
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isBold}
                                onPressedChange={toggleBold}
                                disabled={!editor || !canBold}
                                aria-label="Bold"
                                className={cn('transition-colors', isBold && 'bg-muted text-foreground')}
                            >
                                <Bold className="h-4 w-4"/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Bold (Ctrl/Cmd + B)</TooltipContent>
                    </Tooltip>

                    {/* Italic */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isItalic}
                                onPressedChange={toggleItalic}
                                disabled={!editor || !canItalic}
                                aria-label="Italic"
                                className={cn('transition-colors', isItalic && 'bg-muted text-foreground')}
                            >
                                <Italic className="h-4 w-4"/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Italic (Ctrl/Cmd + I)</TooltipContent>
                    </Tooltip>

                    {/* Strike */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isStrike}
                                onPressedChange={toggleStrike}
                                disabled={!editor || !canStrike}
                                aria-label="Strikethrough"
                                className={cn('transition-colors', isStrike && 'bg-muted text-foreground')}
                            >
                                <Strikethrough className="h-4 w-4"/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Strikethrough</TooltipContent>
                    </Tooltip>

                    {/* Headings H1 → H6 */}
                    {headingLevels.map(level => {
                        const active = isHeadingActive(level);
                        const can = canToggleHeading(level);
                        return (
                            <Tooltip key={level}>
                                <TooltipTrigger asChild>
                                    <Toggle
                                        size="sm"
                                        pressed={active}
                                        onPressedChange={() => toggleHeading(level)}
                                        disabled={!editor || !can}
                                        aria-label={`Heading ${level}`}
                                        className={cn('transition-colors px-2', active && 'bg-muted text-foreground')}
                                    >
                                        {/* Simple label H1..H6 */}
                                        <span className="text-xs font-semibold">{`H${level}`}</span>
                                    </Toggle>
                                </TooltipTrigger>
                                <TooltipContent>{`Heading ${level}`}</TooltipContent>
                            </Tooltip>
                        );
                    })}

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isBulletList}
                                onPressedChange={toggleBulletList}
                                disabled={!editor || !canBulletList}
                                aria-label="BulletList"
                                className={cn('transition-colors', isBulletList && 'bg-muted text-foreground')}
                            >
                                <ListIcon className="h-4 w-4"/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Bullet List</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isOrderedList}
                                onPressedChange={toggleOrderedList}
                                disabled={!editor || !canOrderedList}
                                aria-label="OrderedList"
                                className={cn('transition-colors', isOrderedList && 'bg-muted text-foreground')}
                            >
                                <ListOrdered className="h-4 w-4"/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Ordered List</TooltipContent>
                    </Tooltip>
                </div>

                <div className="w-px h-6 bg-border mx-2"></div>
                <div className="flex  flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor ? editor.isActive({textAlign: 'left'}) : false}
                                onPressedChange={() => editor?.chain().focus().setTextAlign('left').run()}
                                disabled={!editor || !editor.can().chain().focus().setTextAlign('left').run()}
                                aria-label="Align left"
                                className={cn(
                                    'transition-colors',
                                    editor?.isActive({textAlign: 'left'}) && 'bg-muted text-foreground'
                                )}
                            >
                                <AlignLeft className="h-4 w-4"/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Align left</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor ? editor.isActive({textAlign: 'center'}) : false}
                                onPressedChange={() => editor?.chain().focus().setTextAlign('center').run()}
                                disabled={!editor || !editor.can().chain().focus().setTextAlign('center').run()}
                                aria-label="Align center"
                                className={cn(
                                    'transition-colors',
                                    editor?.isActive({textAlign: 'center'}) && 'bg-muted text-foreground'
                                )}
                            >
                                <AlignCenter className="h-4 w-4"/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Align center</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor ? editor.isActive({textAlign: 'right'}) : false}
                                onPressedChange={() => editor?.chain().focus().setTextAlign('right').run()}
                                disabled={!editor || !editor.can().chain().focus().setTextAlign('right').run()}
                                aria-label="Align right"
                                className={cn(
                                    'transition-colors',
                                    editor?.isActive({textAlign: 'right'}) && 'bg-muted text-foreground'
                                )}
                            >
                                <AlignRight className="h-4 w-4"/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Align right</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor ? editor.isActive({textAlign: 'justify'}) : false}
                                onPressedChange={() => editor?.chain().focus().setTextAlign('justify').run()}
                                disabled={!editor || !editor.can().chain().focus().setTextAlign('justify').run()}
                                aria-label="Align justify"
                                className={cn(
                                    'transition-colors',
                                    editor?.isActive({textAlign: 'justify'}) && 'bg-muted text-foreground'
                                )}
                            >
                                <AlignJustify className="h-4 w-4"/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Justify</TooltipContent>
                    </Tooltip>
                </div>
                <div className="w-px h-6 bg-border mx-2"></div>
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                       <Button variant={"ghost"} size={"sm"} type={"button"}
                           onClick={() => editor?.chain().focus().undo().run()}
                           disabled={!editor || !editor.can().undo()}
                           aria-label="Undo"
                           className={cn(
                               'transition-colors',
                               editor?.isActive({textAlign: 'justify'}) && 'bg-muted text-foreground'
                           )} >
                            <UndoIcon className="h-4 w-4"/>
                       </Button>
                        </TooltipTrigger>
                        <TooltipContent>Undo</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant={"ghost"} size={"sm"} type={"button"}
                                    onClick={() => editor?.chain().focus().redo().run()}
                                    disabled={!editor || !editor.can().redo()}
                                    aria-label="Undo"
                                    className={cn(
                                        'transition-colors',
                                        editor?.isActive({textAlign: 'justify'}) && 'bg-muted text-foreground'
                                    )} >
                                <RedoIcon className="h-4 w-4"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redo</TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    );
};

export default Menubar;
