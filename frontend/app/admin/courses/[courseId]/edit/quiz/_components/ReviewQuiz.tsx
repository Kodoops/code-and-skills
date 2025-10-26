"use client";

import React, {useState} from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {CheckIcon, EyeIcon} from "lucide-react";
import {QuizType} from "@/lib/db/types.ts";

const ReviewQuiz = ({quiz}: { quiz: QuizType }) => {

    const [isOpen, setIsOpen] = useState(false)

    function handleOpenChange(open: boolean) {
        setIsOpen(open)
    }

    return (
        <div className={""}>
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <Button variant={"default"} size={"sm"} className={"gap-2 w-full"}>
                        <EyeIcon className={"size-4"}/> Review attached Quiz
                    </Button>
                </DialogTrigger>
                <DialogContent className={"w-full"}>
                    <DialogHeader>
                        <DialogTitle>
                            Quiz Information&apos;s
                        </DialogTitle>
                        <DialogDescription>
                            Details of attached quiz
                        </DialogDescription>
                    </DialogHeader>
                    <div className="">
                        <p className={"text-xl text-center border-b"}>{quiz.title}</p>
                        <p className={"text-sm italic text-muted-foreground py-4"}>{quiz.description}</p>
                        <p className={"text-lg font-semibold border-b"}>Questions :</p>
                        <ul>
                            {
                                quiz.questions && quiz.questions.length > 0 ?
                                    quiz.questions.map((question, index) => (
                                        <li key={question.id} className={" ml-6 text-lg my-4"}>
                                           <span>{index + 1} - </span> {question.question}
                                            {question.options &&  question.options.map(option => (
                                                <p key={option.id} className={"text-sm italic text-muted-foreground flex items-center gap-2 my-3"}>
                                                   -  {option.content} {option.isCorrect? <CheckIcon className={"size-4 text-primary"}/> : null}
                                                </p>
                                            ))}
                                        </li>
                                    ))
                                    :
                                    <p className={"text-center text-lg"}>No questions attached</p>
                            }
                        </ul>
                    </div>
                </DialogContent>
            </Dialog></div>
    );
};

export default ReviewQuiz;
