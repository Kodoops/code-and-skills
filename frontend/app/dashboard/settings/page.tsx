import React from 'react';
import Link from "next/link";

const Page = () => {
    return (
        <div>
            <Link href={"/dashboard/settings/change-password"}>
                Changer Mot de passe
            </Link>
        </div>
    );
};

export default Page;