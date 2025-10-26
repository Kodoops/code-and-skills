import axios from "axios";

export const AxiosPublicClient = async () => {

    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,
        withCredentials: false,
    });


    return instance;
};