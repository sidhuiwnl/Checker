import React from 'react';
import {UptimeStatus} from "@/app/(main)/dashboard/_components/dashboard";

export type TickStatus = "up" | "down" | "unknown";

interface Tick {

    ticks : UptimeStatus[];
}



const MonitorTicks: React.FC<Tick> = ({ ticks }) => {
    return (
        <div className="flex items-center gap-1 my-2">
            {ticks.map((tick, index) => {
                const statusColor =
                    tick === "good" ? "bg-green-500" :
                        tick === "bad" ? "bg-red-500" :
                            "bg-gray-400";

                return (
                    <div
                        key={index}
                        className={`h-2 w-2 ${statusColor} rounded-sm`}
                        title={`${tick.toUpperCase()} `}
                    />
                );
            })}
        </div>
    );
};

export default MonitorTicks;
