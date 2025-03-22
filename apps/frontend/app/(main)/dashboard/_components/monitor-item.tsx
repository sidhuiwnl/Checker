import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import MonitorTicks, { TickStatus } from "@/app/(main)/dashboard/_components/monitor-ticks";
import { UptimeStatus } from "@/app/(main)/dashboard/_components/dashboard";
import Link from "next/link";


interface MonitorItemProps {
    name: string;
    status: UptimeStatus;
    time: string;
    uptime?: string;
    uptimeTicks?: UptimeStatus[];
}

const MonitorItem: React.FC<MonitorItemProps> = ({ name, status, time, uptime,uptimeTicks }) => {
    const getStatusColor = () => {
        switch(status) {
            case "good": return "bg-green-500";
            case "bad": return "bg-red-500";
            case "paused": return "bg-yellow-500";
            case "unknown": return "bg-gray-500";
            default: return "bg-gray-500";
        }
    };



    return (
        <div className="flex flex-col py-4 px-6 hover:bg-white/5 transition-colors rounded-md">

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`${getStatusColor()} h-2.5 w-2.5 rounded-full`}></div>
                    <div>
                        <p className="text-white font-medium">{name}</p>
                        {status === "good" && uptime && (
                            <p className="text-gray-400 text-sm">Up · {uptime}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm">{time}</span>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <MoreHorizontal size={18} />
                    </button>
                </div>
            </div>

            <div className="pl-6 mt-1">
                { uptimeTicks && <MonitorTicks ticks={uptimeTicks} /> }
            </div>
        </div>
    );
};

export default MonitorItem;
