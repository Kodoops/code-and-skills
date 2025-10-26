import React from 'react';
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {useSession} from "@/hooks/useSession";

const UserMobileLink = () => {

    const {user, loading} = useSession();

    if(loading) return (
        <div>Loading...</div>
    )

    return (
        <div className="mt-4 flex flex-col gap-2">
            {loading ? null : user ? (
                <>
                    <Link
                        href="/dashboard"
                        className={buttonVariants({variant: "default", className: "w-full"})}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/profile"
                        className={buttonVariants({variant: "secondary", className: "w-full"})}
                    >
                        Mon profil
                    </Link>
                </>
            ) : (
                <>
                    <Link
                        href="/login"
                        className={buttonVariants({variant: "secondary", className: "w-full"})}
                    >
                        Se connecter
                    </Link>
                    <Link
                        href="/signin"
                        className={buttonVariants({className: "w-full"})}
                    >
                        Commencer a apprendre
                    </Link>
                </>
            )}
        </div>
    );
};

export default UserMobileLink;