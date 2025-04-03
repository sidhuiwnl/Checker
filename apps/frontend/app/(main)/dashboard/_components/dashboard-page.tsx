"use client"

import { useState } from "react"
import {Plus, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react"
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
import {ChartParent} from "@/app/(main)/dashboard/_components/area-chart-monitor";
import Link from "next/link";

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

            return {
                id,
                url,
                status,
                lastChecked: lastCheck ? new Date(lastCheck.createdAt).toLocaleTimeString() : "N/A",
                history: sortedTicks.slice(0, 10).map((tick) => (tick.status === "GOOD" ? 1 : 0)),
            };
        })
        : [];









    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-zinc-950 text-white flex flex-col">
            <div className="container mx-auto px-4 py-8 max-w-7xl flex-1 flex flex-col md:flex-row gap-6">
                <div className="md:w-64 shrink-0">
                    <div className="sticky top-24">
                        <div className="hidden md:flex flex-col gap-1 mb-6">
                            <h1 className="text-2xl font-bold">Welcome back,</h1>
                            <p className="text-zinc-400 font-medium">How are you today, Sidharth?</p>
                        </div>

                        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/50 overflow-hidden mb-4 hidden md:block">
                            <div className="p-3 flex flex-col gap-1">
                                <Button variant="ghost" className="justify-start h-9 px-2 rounded-lg">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                                    Dashboard
                                </Button>
                                <Button variant="ghost" className="justify-start h-9 px-2 rounded-lg bg-zinc-800/50">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                                    Monitors
                                </Button>
                                <Button variant="ghost" className="justify-start h-9 px-2 rounded-lg">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                                    Alerts
                                </Button>
                                <Button variant="ghost" className="justify-start h-9 px-2 rounded-lg">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                                    Settings
                                </Button>
                            </div>
                        </div>


                        <div className="hidden md:block">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-sm font-medium text-zinc-400">QUICK STATS</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-zinc-900/30 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-3">
                                    <div className="text-xs text-zinc-500 mb-1">Total Monitors</div>
                                    <div className="text-xl font-semibold">{monitors.length}</div>
                                </div>
                                <div className="bg-zinc-900/30 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-3">
                                    <div className="text-xs text-zinc-500 mb-1">Uptime</div>
                                    <div className="text-xl font-semibold">99.8%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-medium hidden md:block">Monitors</h2>
                        <Link href={"/dashboard/create-monitor"}>
                            <Button  className="bg-gradient-to-r hover:bg-neutral-900 bg-neutral-900 text-white rounded-lg h-10 px-4 flex items-center gap-2 ml-auto shadow-lg shadow-indigo-900/20 border-0">
                                <Plus className="h-4 w-4" />
                                <span>Create monitor</span>
                            </Button>
                        </Link>

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

                    <motion.div
                        className="bg-zinc-900/30 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-5"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">Monitor Details</h3>
                            <div className="text-xs bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded-full">Online</div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-zinc-800/30 rounded-lg p-3">
                                <div className="text-xs text-zinc-500 mb-1">URL</div>
                                <div className="text-sm font-medium">{monitors[activeMonitor]?.url}</div>
                            </div>
                            <div className="bg-zinc-800/30 rounded-lg p-3">
                                <div className="text-xs text-zinc-500 mb-1">Last Checked</div>
                                <div className="text-sm font-medium">{monitors[activeMonitor]?.lastChecked}</div>
                            </div>
                            <div className="bg-zinc-800/30 rounded-lg p-3">
                                <div className="text-xs text-zinc-500 mb-1">Uptime</div>
                                <div className="text-sm font-medium">99.8%</div>
                            </div>
                        </div>



                    </motion.div>

                </div>

            </div>
            <div className=" rounded-lg flex items-center justify-center h-[600px] w-full overflow-hidden">
                <ChartParent
                    key={monitors ? monitors[activeMonitor]?.id : "empty"}
                    monitor={monitors ? monitors[activeMonitor]?.id : null}
                />
            </div>
        </div>
    )
}

