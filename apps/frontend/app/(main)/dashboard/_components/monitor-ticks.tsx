
import React from 'react';

export type TickStatus = 'up' | 'down' | 'unknown';

interface Tick {
    timestamp: string;
    status: TickStatus;
}

interface MonitorTicksProps {
    ticks: Tick[];
}

const MonitorTicks: React.FC<MonitorTicksProps> = ({ ticks }) => {
    return (
        <div className="flex items-center gap-1 my-2">
            {ticks.map((tick, index) => {
                const statusColor =
                    tick.status === 'up' ? 'bg-green-500' :
                        tick.status === 'down' ? 'bg-red-500' :
                            'bg-gray-400';

                return (
                    <div
                        key={index}
                        className={`h-2 w-1 ${statusColor} rounded-sm`}
                        title={`${tick.status.toUpperCase()} at ${tick.timestamp}`}
                    />
                );
            })}
        </div>
    );
};

export default MonitorTicks;