import { Star, StarHalf } from "lucide-react";

interface RatingStarsProps {
    rating: number;   // ex: 4.5
    outOf?: number;   // ex: 5
}

export function RatingStars({ rating, outOf = 5 }: RatingStarsProps) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
        <div className="flex items-center">
            {Array.from({ length: outOf }).map((_, index) => {
                if (index < fullStars) {
                    // étoile pleine
                    return (
                        <Star
                            key={index}
                            className="size-4 fill-primary text-primary"
                        />
                    );
                } else if (index === fullStars && hasHalfStar) {
                    // demi-étoile
                    return (
                        <StarHalf
                            key={index}
                            className="size-4 fill-primary text-primary"
                        />
                    );
                } else {
                    // étoile vide
                    return (
                        <Star
                            key={index}
                            className="size-4 text-muted-foreground"
                        />
                    );
                }
            })}
        </div>
    );
}
