"use client";

import { toast } from "sonner";
import {logoutAllAction} from "@/actions/auth/auth";
import {useRouter} from "next/navigation";

export default function LogoutAllButton() {

    const router = useRouter();

    const handleLogoutAll = async () => {
        const result = await logoutAllAction();

        if (result.success) {
            toast.success(result.message,  {
                style: {
                    background: "#D1FAE5",
                    color: "#065F46",
                },
            });

            router.push("/");
            router.refresh();
            setTimeout(() => window.location.reload(), 200);
        } else {
            toast.error(result.message,{
                style: {
                    background: "#FEE2E2",
                    color: "#991B1B",
                },
            });
        }
    };

    return (
        <button
            onClick={handleLogoutAll}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
            Déconnecter toutes mes sessions
        </button>
    );
}