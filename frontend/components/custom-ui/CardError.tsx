import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CircleOff } from "lucide-react";

interface CardErreurProps {
    message: string;
    title?: string;
    icon?: React.ElementType; // 👈 On autorise n’importe quel composant d’icône (Lucide, Heroicons, etc.)
    iconSize?: number;
    iconClassName?: string;
}

const CardError: React.FC<CardErreurProps> = ({
                                                   message,
                                                   title = "Erreur",
                                                   icon: Icon = CircleOff,
                                                   iconSize = 100,
                                                   iconClassName = "text-muted-foreground/40",
                                               }) => {
    return (
        <Card className="space-y-3 w-lg mx-auto">
            <CardHeader>
                <h2 className="text-primary text-2xl font-bold w-full text-center border-b pb-2">
                    {title}
                </h2>
            </CardHeader>

            <CardContent className="flex flex-col items-center justify-center space-y-4">
                <Icon className={iconClassName} size={iconSize} />
                <p className="text-muted-foreground">
                    {message || "❌ Une erreur est survenue."}
                </p>
            </CardContent>
        </Card>
    );
};

export default CardError;