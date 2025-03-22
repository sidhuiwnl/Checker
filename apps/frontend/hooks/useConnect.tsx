"use client"

import axios from "axios";
import {useAuth} from "@clerk/nextjs";
import {useEffect, useState} from "react";
import {BACKEND_URL} from "@/config";

interface Websites{
    id : string;
    url : string;
    userId  : string;
    websiteTick : {
        id : string;
        createdAt : string;
        status : string;
        latency : number;
        total : number;
        tlsHandshake : number;
        dataTransfer : number;
        connection : number;
    }[];
}

export default function useConnect() {
    const[websites,setWebsites] = useState<Websites[]>([])
    const { getToken } = useAuth();

    async function connectBackend(){
        const token = await getToken();

        const response = await axios.get(`${BACKEND_URL}/api/v1/websites`,{
            headers : {
                Authorization: `Bearer ${token}`
            }
        })



        setWebsites(response.data.data);

        console.log(response.data.data);

    }
    useEffect(() =>{
        connectBackend()

        const interval = setInterval(() =>{
            connectBackend()
        },1000 * 60);

        return () => {
            clearInterval(interval);
        }

    },[])

    return {
        websites,
        connectBackend
    }
}