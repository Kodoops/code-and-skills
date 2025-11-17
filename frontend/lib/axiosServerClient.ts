import axios from "axios";
import { cookies } from "next/headers";
import {refreshTokenAction} from "@/actions/auth/auth";

/**
 * Crée une instance Axios côté serveur
 * avec le token JWT automatiquement ajouté s'il existe.
 */
export const AxiosServerClient = async () => {

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,
        headers: token
            ? {Authorization: `Bearer ${token}`}
            : {},
        withCredentials: true,
    });

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                const result = await refreshTokenAction();

                if (result.status === "success" && result.data.accessToken) {
                    originalRequest.headers.Authorization = `Bearer ${result.data.accessToken}`;

                    return axios(originalRequest);
                }

              //  return Promise.reject({ sessionExpired: true });
            }

            return Promise.reject(error);
        }
    );

    return instance;
};