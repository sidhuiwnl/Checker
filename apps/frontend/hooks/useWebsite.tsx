import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { BACKEND_URL } from "@/config";

export interface Website {
    id: string;
    url: string;
    userId: string;
    websiteTick: {
        id: string;
        createdAt: string;
        status: "GOOD" | "BAD";
        latency: number;
        total: number;
        tlsHandshake: number;
        dataTransfer: number;
        connection: number;
    }[];
}


export default function useWebsite(websiteId: string | null) {
    const [website, setWebsite] = useState<Website | null>(null);
    const { getToken } = useAuth();

    const connectBackend = useCallback(async (id: string | null) => {
        if (!id) {
            setWebsite(null);
            return;
        }



        try {
            const token = await getToken();
            if (!token) return;

            const response = await axios.get(`${BACKEND_URL}/api/v1/website/status`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { websiteId: id },
            });

            setWebsite(response.data.data);
        } catch (error) {
            console.error("Failed to fetch website data:", error);
            setWebsite(null);
        }
    }, [getToken]);

    useEffect(() => {
        connectBackend(websiteId);

        const interval = setInterval(() => {
            connectBackend(websiteId);
        }, 1000 * 60);

        return () => clearInterval(interval);
    }, [websiteId, connectBackend]);

    return website;
}