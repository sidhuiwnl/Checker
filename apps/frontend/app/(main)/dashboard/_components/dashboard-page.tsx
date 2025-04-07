"use client"

import { useState } from "react"
import {MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import useConnect from "@/hooks/useConnect";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

import {ChartAreaInteractive} from "@/components/chart-area-interactive";
import {SectionCards} from "@/components/section-cards";

export default function DashboardComponent() {
    const [isMonitorsOpen, setIsMonitorsOpen] = useState(true)
    const [activeMonitor, setActiveMonitor] = useState(0);




    const website = useConnect();







    const monitors = website.websites
        ? website.websites.map(({ url, websiteTick, id }) => {
            const sortedTicks = [...websiteTick].sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            const lastCheck = sortedTicks[0] ?? null;
            const status = lastCheck && lastCheck.status === "GOOD" ? "online" : "offline";
           const history = sortedTicks.slice(0, 10).map((tick) => (tick.status === "GOOD" ? 1 : 0))


            const uptimePercentage = history.length > 0
                //@ts-ignore
                ? (history.reduce((a, b) => (a + b), 0) / history.length) * 100
                : 0;


            return {
                id,
                url,
                status,
                lastChecked: lastCheck ? new Date(lastCheck.createdAt).toLocaleTimeString() : "N/A",
                history,
                uptimePercentage : uptimePercentage.toFixed(2) + "%",

            };
        })
        : [];

    console.log(monitors[activeMonitor]?.id)


    return (
        <div className=" text-white flex flex-col">
            <div className="container mx-auto px-4  max-w-7xl flex-1 flex flex-col md:flex-row gap-6">

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-medium hidden md:block">Monitors</h2>


                    </div>

                    <motion.div
                        className="bg-zinc-900/30 backdrop-blur-sm rounded-xl border border-zinc-800/50 overflow-hidden mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-800/20 transition-colors"
                            onClick={() => setIsMonitorsOpen(!isMonitorsOpen)}
                        >
                            <div className="flex items-center gap-2">
                                {isMonitorsOpen ? (
                                    <ChevronUp className="h-4 w-4 text-zinc-400" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-zinc-400" />
                                )}
                                <h2 className="font-medium">Active Monitors</h2>
                                <div className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{monitors.length}</div>
                            </div>
                        </div>

                        {isMonitorsOpen && (
                            <div className="border-t border-zinc-800/50">
                                {monitors.map((monitor, index) => (
                                    <motion.div
                                        key={index}
                                        className={cn(
                                            "border-b border-zinc-800/50 last:border-0 transition-colors",
                                            activeMonitor === index ? "bg-zinc-800/30" : "hover:bg-zinc-800/20",
                                        )}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        onClick={() => setActiveMonitor(index)}
                                    >
                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></div>
                                                <span className="text-sm">{monitor.url}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    {monitor.history.map((status, i) => (
                                                        <div
                                                            key={i}
                                                            className={`h-1.5 w-1.5 rounded-full ${status ? "bg-emerald-500" : "bg-zinc-700"}`}
                                                        ></div>
                                                    ))}
                                                </div>
                                                <span className="text-xs text-zinc-500">{monitor.lastChecked}</span>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-zinc-500 hover:text-white rounded-full"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-zinc-800">
                                                        <DropdownMenuItem className="focus:bg-zinc-800">View details</DropdownMenuItem>
                                                        <DropdownMenuItem className="focus:bg-zinc-800">Edit monitor</DropdownMenuItem>
                                                        <DropdownMenuItem className="focus:bg-zinc-800">Pause monitoring</DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-zinc-800" />
                                                        <DropdownMenuItem className="focus:bg-zinc-800 text-red-500">
                                                            Delete monitor
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>



                </div>

            </div>

            <SectionCards/>
            <div className="px-4 lg:px-6 mt-7">
                <ChartAreaInteractive monitorId={monitors[activeMonitor]?.id} />
            </div>

        </div>
    )
}

