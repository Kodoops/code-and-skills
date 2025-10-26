import { AxiosServerClient } from "./axiosServerClient";

/**
 * Récupère l'utilisateur courant depuis le Auth Service.
 */
export async function getCurrentUser() {
    try {
        const client = await AxiosServerClient();
        const res = await client.get("/auth/profile");
        return res.data.data || res.data;
    } catch (err) {
        return null;
    }
}
