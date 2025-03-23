"use client"

import useWebsite from "@/hooks/useWebsite";
import {Component} from "@/app/(main)/dashboard/[monitor]/_components/chart";
import {clsx} from "clsx";

type Props = {
    monitor : string;
};

export  function ChartParent({ monitor }: Props) {
    const website  = useWebsite(monitor);




    return(
        <div className="min-w-7xl">
            <div className="flex items-center gap-2">
                <div className={clsx(
                    website?.websiteTick?.[website?.websiteTick.length - 1]?.status === "GOOD"
                        ? "bg-green-300"
                        : "bg-red-400",
                    "w-5 h-5 rounded-full" // Ensure width & height for a circle
                )}></div>
                <h1 className="text-2xl font-medium">{website?.url}</h1>
            </div>


            <p className="mb-5">
                {website?.websiteTick[0].status === "GOOD" ? <span className="text-green-400">Up</span> : <span>Down</span>}
            </p>

            { website?.websiteTick ? (
                <Component websiteTicks={website?.websiteTick} />
            ) : (
                <div>No data</div>
            ) }
        </div>
    )
}