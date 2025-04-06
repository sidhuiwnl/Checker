

import useWebsite from "@/hooks/useWebsite";
import  Chart  from "@/app/(main)/dashboard/_components/chart";
import {useEffect,useState} from "react";
import {LoaderIcon} from "lucide-react";


type Props = {
    monitor : string | null;
};

export  function ChartParent({ monitor }: Props) {



    const website = useWebsite(monitor);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        // Small delay to prevent flickering when data loads quickly
        const timer = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(timer);
    }, [monitor]);

    const status = website?.websiteTick[website?.websiteTick.length - 1]?.status;

    const chartData = website?.websiteTick.map(({
                                                    createdAt,
                                                    total,
                                                    latency,
                                                    tlsHandshake,
                                                    dataTransfer,
                                                    connection,
                                                }) => ({
        createdAt,
        total,
        latency,
        tlsHandshake,
        dataTransfer,
        connection,
    }));


    return (
        <div className="w-full">
            {isLoading ? (
                <div className="flex flex-col items-center animate-spin">
                    <LoaderIcon />
                </div>
            ) : chartData ? (
                <Chart
                    url={website?.url as string}
                    status={status!}
                    chartData={chartData}
                />
            ) : (
                <div className="text-center">
                    No data Available
                </div>
            )}
        </div>
    );
}