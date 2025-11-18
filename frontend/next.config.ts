import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        serverActions: {
            // par exemple 4 Mo
            bodySizeLimit: '10gb',
        },
    },
    images:{
        remotePatterns:[
            {
                hostname: 'code-skills-lms.t3.storage.dev',
                port   :'',
                protocol: 'https',
            },
            {
                hostname: 'avatars.githubusercontent.com',
                port   :'',
                protocol: 'https',
            },
            {
                hostname: 'codeandskills.s3.eu-west-1.amazonaws.com',
                port   :'',
                protocol: 'https',
            }
        ]
    },
};

export default nextConfig;
