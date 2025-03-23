
import axios from "axios";
import {useAuth} from "@clerk/nextjs";
import {useEffect, useState} from "react";
import {BACKEND_URL} from "@/config";

interface Website{
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

export default function useWebsite(websiteId:string) {
    const[website,setWebsite] = useState<Website | null>(null)
    const { getToken } = useAuth();

    async function connectBackend(){
        const token = await getToken();

        const response = await axios.get(`${BACKEND_URL}/api/v1/website/status`,{
            headers : {
                Authorization: `Bearer ${token}`
            },
            params : { websiteId}
        })



        setWebsite(response.data.data);

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

    return website

}