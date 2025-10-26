import React from 'react';

interface Props {
    size:string;
}

const ImageSvg = ({size}: Props) => {
    size = size || '24';
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" fill="#E0F2FE"/>
            <circle cx="8" cy="8" r="2" fill="#0284C7"/>
            <path d="M21 17L16 12L5 21" stroke="#0369A1" stroke-width="2"/>
        </svg>
    );
};

export default ImageSvg;
