import React from "react";

interface StartIconProps {
    size?: number | string;
    className?: string;
}

const StartSVG: React.FC<StartIconProps> = ({
                                                size = 24,
                                                className,
                                            }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            width={size}
            height={size}
            className={className}
        >
            {/* Cercle de départ */}
            <circle
                cx="7"
                cy="12"
                r="3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Flèche vers l’avant */}
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 12h9m0 0l-3-3m3 3l-3 3"
            />
        </svg>
    );
};

export default StartSVG;
