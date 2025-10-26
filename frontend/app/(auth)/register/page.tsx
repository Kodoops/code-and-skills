"use client";

import {redirect} from "next/navigation";
import {useSession} from "@/hooks/useSession";
import RegisterForm from "@/app/(auth)/register/_components/RegisterForm";

const RegisterPage = () => {

    const {authenticated} = useSession();

    if (authenticated
    ) {
        return redirect("/")
    }

    return (
        <RegisterForm/>
    );
};

export default RegisterPage;
