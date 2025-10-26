import React from 'react';

interface Props {
    size?: string | number;
    bgClass?: string;    // ex: "fill-gray-200"
    headClass?: string;  // ex: "fill-gray-400"
    bodyClass?: string;  // ex: "fill-gray-400"
}

const UserSvg = ({
                     size = 64,
                     bgClass = "fill-muted-foreground/10",
                     headClass = "fill-gray-600",
                     bodyClass = "fill-gray-600",
                 }: Props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            width={size}
            height={size}
            className="inline-block"
        >
            <circle cx="32" cy="32" r="32" className={bgClass} />
            <circle cx="32" cy="26" r="10" className={headClass} />
            <path d="M16 50c4-8 12-12 16-12s12 4 16 12" className={bodyClass} />
        </svg>
    );
};

export default UserSvg;
