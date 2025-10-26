import React from 'react';
import { Card } from "@/components/ui/card";
import { getStats } from '@/actions/stats';

const Stats = async () => {
    const { courses, lessons, quizzes } = await getStats();

    return (
        <div className="mt-10 grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
                { k: `+ ${lessons}`, v: "Leçons vidéos" },
                { k: `+ ${courses}`, v: "Formations" },
                { k: `+ ${quizzes}`, v: "Exercices / Quiz" },
                { k: "100%", v: "Pratique" },
            ].map((s) => (
                <Card key={s.v}>
                    <div className="text-2xl font-extrabold">{s.k}</div>
                    <div className="text-xs text-muted-foreground">{s.v}</div>
                </Card>
            ))}
        </div>
    );
};

export default Stats;
