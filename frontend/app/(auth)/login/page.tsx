"use client";

import LoginForm from "@/app/(auth)/login/_components/LoginForm";
import {useSession} from "@/hooks/useSession";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

const LoginPage =  () => {

    const router = useRouter();

    const {authenticated} = useSession();

    useEffect(() => {
        if (authenticated) {
            router.push("/dashboard");
        }
    }, [authenticated, router]);

    return (
        <LoginForm/>
    );
};

export default LoginPage;
