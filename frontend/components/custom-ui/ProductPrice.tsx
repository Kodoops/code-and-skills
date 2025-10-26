import React from 'react';
import {IconCash} from "@tabler/icons-react";

const ProductPrice = ({finalPrice, price, size, currency}:{finalPrice:number, price: number, size?:string, currency?:string}) => {

    const currencyToUse = currency || 'EUR';

    return (
        <div className="flex items-center gap-x-2">
            <IconCash
                className={`size-6 p-1 rounded-md bg-primary/10 ${finalPrice === 0 ? "text-green-600" : "text-primary"}`}
            />

            {price !== 0 && finalPrice !== price && (
                <p className="text-base text-foreground font-medium line-through opacity-70">
                    {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: currencyToUse,
                    }).format(price / 100)}
                </p>
            )}

            <p className={` ${finalPrice === 0 ? "text-green-600" : "text-primary"} font-semibold ${size ? `text-${size}`: "text-xl"}` }>
                {finalPrice !== 0 ? new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: currencyToUse,
                }).format(finalPrice / 100)  : "Gratuit"}
            </p>
        </div>
    );
};

export default ProductPrice;
