import React from 'react';

interface Props {
    size:string;
}

const FileSvg = ({size}: Props) => {
    size = size || '24';
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path fill="#E5E7EB" d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
            <path fill="#9CA3AF" d="M13 2v6h5"/>
            <path fill="#6B7280" d="M8 14h8v2H8zm0-4h8v2H8z"/>
        </svg>
    );
};

export default FileSvg;
