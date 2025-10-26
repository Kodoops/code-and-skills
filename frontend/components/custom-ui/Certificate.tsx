import React from "react";

interface CertificateProps {
    size?: number | string;
    color?: string;
    className?: string;
}

const CertificateSVG: React.FC<CertificateProps> = ({
                                                     size = 24,
                                                     color = "currentColor",
                                                     className,
                                                 }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke={color}
            strokeWidth={1}
            width={size}
            height={size}
            className={className}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l3.09 1.64-.59-3.45 2.5-2.44-3.46-.5L12 6.5l-1.54 3.15-3.46.5 2.5 2.44-.59 3.45L12 14z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14v6m0 0l-2.5-2m2.5 2l2.5-2"
            />
        </svg>
    );
};

export default CertificateSVG;
