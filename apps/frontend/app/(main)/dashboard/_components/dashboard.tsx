"use client"

import React, { useState,useMemo } from 'react';
import DashboardHeader from "@/app/(main)/dashboard/_components/dashboard-header";
import MonitorItem from "@/app/(main)/dashboard/_components/monitor-item";
import { ChevronDown } from 'lucide-react';
import useConnect from "@/hooks/useConnect";


type UptimeStatus = "good" | "bad" | "unknown";



const DashboardPage = () => {
    const [isMonitorsExpanded, setIsMonitorsExpanded] = useState(true);
    const {websites,connectBackend} = useConnect();

    const processedWebsites = useMemo(() => {
        return websites.map(website  => {
            // Sort ticks by creation time
            const sortedTicks = [...website.websiteTick].sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            // Get the most recent 30 minutes of ticks
            const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
            const recentTicks = sortedTicks.filter(tick =>
                new Date(tick.createdAt) > thirtyMinutesAgo
            );

            // Aggregate ticks into 3-minute windows (10 windows total)
            const windows: UptimeStatus[] = [];

            for (let i = 0; i < 10; i++) {
                const windowStart = new Date(Date.now() - (i + 1) * 3 * 60 * 1000);
                const windowEnd = new Date(Date.now() - i * 3 * 60 * 1000);

                const windowTicks = recentTicks.filter(tick => {
                    const tickTime = new Date(tick.createdAt);
                    return tickTime >= windowStart && tickTime < windowEnd;
                });

                // Window is considered up if majority of ticks are up
                const upTicks = windowTicks.filter(tick => tick.status === 'Good').length;
                windows[9 - i] = windowTicks.length === 0 ? "unknown" : (upTicks / windowTicks.length) >= 0.5 ? "good" : "bad";
            }

            // Calculate overall status and uptime percentage
            const totalTicks = sortedTicks.length;
            const upTicks = sortedTicks.filter(tick => tick.status === 'Good').length;
            const uptimePercentage = totalTicks === 0 ? 100 : (upTicks / totalTicks) * 100;

            // Get the most recent status
            const currentStatus = windows[windows.length - 1];

            // Format the last checked time
            const lastChecked = sortedTicks[0]
                ? new Date(sortedTicks[0].createdAt).toLocaleTimeString()
                : 'Never';

            return {
                id: website.id,
                url: website.url,
                status: currentStatus,
                uptimePercentage,
                lastChecked,
                uptimeTicks: windows,
            };
        });
    }, [websites]);

    return (
        <div className="min-h-screen bg-[oklch(0.145_0_0)] text-white">
            <DashboardHeader />
            <main className="container mx-auto px-6 py-6 max-w-7xl animate-slide-up">
                <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                    <div
                        className="flex items-center gap-2 px-6 py-4 border-b border-white/10 cursor-pointer"
                        onClick={() => setIsMonitorsExpanded(!isMonitorsExpanded)}
                    >
                        <ChevronDown
                            size={20}
                            className={`transition-transform ${isMonitorsExpanded ? 'transform rotate-0' : 'transform -rotate-90'}`}
                        />
                        <h2 className="text-lg font-medium">Monitors</h2>
                    </div>

                    {isMonitorsExpanded &&

                        (
                        <div className="divide-y divide-white/5">
                            <MonitorItem
                                name="endorsement-nine.vercel.app"
                                status="up"
                                time="3m"
                                uptime="1d 3h 23m"
                            />
                            <MonitorItem
                                name="api.example.com"
                                status="down"
                                time="28m"
                            />
                            <MonitorItem
                                name="dashboard.example.com"
                                status="up"
                                time="5m"
                                uptime="6d 14h 45m"
                            />
                            <MonitorItem
                                name="auth.example.com"
                                status="paused"
                                time="1h"
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;