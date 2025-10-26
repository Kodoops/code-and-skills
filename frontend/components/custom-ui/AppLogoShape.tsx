import React from 'react';
import Image from "next/image";

interface Props {
    logo: string;
    width: number;
    height: number;
    priority?: boolean;
    alt?: string;
}

const AppLogoShape = ({
                          logo,
                          width,
                          height,
                          priority = false,
                          alt = "code and skills logo",
                      }: Props) => {
    return (
        <Image
            src={logo}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
        />
    );
};

export default AppLogoShape;
