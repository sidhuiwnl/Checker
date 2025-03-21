"use client";

import React, { useState, useMemo } from "react";
import DashboardHeader from "@/app/(main)/dashboard/_components/dashboard-header";
import MonitorItem from "@/app/(main)/dashboard/_components/monitor-item";
import { ChevronDown } from "lucide-react";
import useConnect from "@/hooks/useConnect";

export type UptimeStatus = "good" | "bad" | "paused" | "unknown";

interface ProcessedWebsite {
    id: string;
    url: string;
    status: UptimeStatus;
    uptimePercentage: number;
    lastChecked: string;
    uptimeTicks: UptimeStatus[];
}

const DashboardPage = () => {
    const [isMonitorsExpanded, setIsMonitorsExpanded] = useState(true);
    const { websites } = useConnect();

    console.log(websites)

    const processedWebsites = useMemo(() => {
        return websites.map((website) => {
            // Sort ticks by creation time (newest first)
            const sortedTicks = [...website.websiteTick].sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            // Get ticks from the last 30 minutes
            const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
            const recentTicks = sortedTicks.filter(
                (tick) => new Date(tick.createdAt).getTime() > thirtyMinutesAgo
            );

            // Aggregate ticks into 3-minute windows (10 windows)
            const windows: UptimeStatus[] = [];

            for (let i = 0; i < 10; i++) {
                const windowStart = Date.now() - (i + 1) * 3 * 60 * 1000;
                const windowEnd = Date.now() - i * 3 * 60 * 1000;

                const windowTicks = recentTicks.filter((tick) => {
                    const tickTime = new Date(tick.createdAt).getTime();
                    return tickTime >= windowStart && tickTime < windowEnd;
                });

                // Determine the window status
                const upTicks = windowTicks.filter((tick) => tick.status === "GOOD").length;
                windows[9 - i] =
                    windowTicks.length === 0
                        ? "unknown"
                        : upTicks / windowTicks.length >= 0.5
                            ? "good"
                            : "bad";
            }

            // Compute overall uptime percentage
            const totalTicks = sortedTicks.length;
            const upTicks = sortedTicks.filter((tick) => tick.status === "GOOD").length;
            const uptimePercentage = totalTicks > 0 ? (upTicks / totalTicks) * 100 : 100;

            // Get the most recent status
            const currentStatus = windows[windows.length - 1] || "unknown";

            // Format last checked time
            const lastChecked =
                sortedTicks.length > 0
                    ? new Date(sortedTicks[0].createdAt).toLocaleTimeString()
                    : "Never";

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
                        <ChevronDown size={20} className={`transition-transform ${isMonitorsExpanded ? "rotate-0" : "-rotate-90"}`} />
                        <h2 className="text-lg font-medium">Monitors</h2>
                    </div>
                    {isMonitorsExpanded && (
                        <div className="divide-y divide-white/5">
                            {processedWebsites?.map(({ id, url, status, lastChecked,uptimeTicks }) => (

                                <MonitorItem key={id} name={url} status={status} time={lastChecked} uptimeTicks={uptimeTicks}  />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
