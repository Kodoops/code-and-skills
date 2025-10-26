import {Promotion} from "@/models";

export const calculatedPrice = (price: number, promotion?: Promotion) => {

    return   promotion
        ? promotion.type === "PERCENTAGE"
            ? price! * (1 - promotion.discount / 100)
            : Math.max(price! - promotion.discount, 0)
        : price;
}
