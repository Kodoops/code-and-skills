import React from 'react';

interface Props {
    size: string;
}

const VideoSvg = ({size}: Props) => {
    size = size || '24';
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" fill="#FEF3C7"/>
            <path d="M10 8L16 12L10 16V8Z" fill="#F59E0B"/>
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D97706" stroke-width="2"/>
        </svg>
    );
};

export default VideoSvg;
