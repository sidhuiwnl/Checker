import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import  MonitorTicks ,{TickStatus } from "@/app/(main)/dashboard/_components/monitor-ticks";

// Generate mock tick data for demonstration
const generateMockTicks = (count: number, status: 'up' | 'down' | 'paused') => {
    const now = new Date();
    const ticks = [];

    for (let i = 0; i < count; i++) {
        const tickTime = new Date(now.getTime() - (i * 30 * 60000)); // 30 minutes intervals
        const randomStatus: TickStatus =
            status === 'up' ? (Math.random() > 0.1 ? 'up' : 'unknown') :
                status === 'down' ? (Math.random() > 0.7 ? 'down' : 'unknown') :
                    'unknown';

        ticks.push({
            timestamp: tickTime.toLocaleTimeString(),
            status: randomStatus
        });
    }

    return ticks.reverse(); // Show oldest to newest
};

interface MonitorItemProps {
    name: string;
    status: 'up' | 'down' | 'paused';
    time: string;
    uptime?: string;
}

const MonitorItem: React.FC<MonitorItemProps> = ({
                                                     name,
                                                     status,
                                                     time,
                                                     uptime
                                                 }) => {
    const getStatusColor = () => {
        switch(status) {
            case 'up': return 'bg-green-500';
            case 'down': return 'bg-red-500';
            case 'paused': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    const mockTicks = generateMockTicks(24, status); // 24 ticks = 12 hours (30min intervals)

    return (
        <div className="flex flex-col py-4 px-6 hover:bg-white/5 transition-colors rounded-md">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`${getStatusColor()} h-2.5 w-2.5 rounded-full`}></div>
                    <div>
                        <p className="text-white font-medium">{name}</p>
                        {status === 'up' && uptime && (
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
                <MonitorTicks ticks={mockTicks} />
            </div>
        </div>
    );
};

export default MonitorItem;