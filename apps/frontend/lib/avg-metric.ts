import {Website} from "@/hooks/useWebsite";

interface WebsiteStats {
    uptimePercentage: number;
    averageLatency: number;
    averageConnectionTime: number;
    averageDataTransfer: number;
    deltas : {
        uptimePercentage: number;
        averageLatency: number;
        averageConnectionTime: number;
        averageDataTransfer: number;
    }
}

interface WebsiteTick {
    id: string;
    createdAt: string;
    status: "GOOD" | "BAD";
    latency: number;
    total: number;
    tlsHandshake: number;
    dataTransfer: number;
    connection: number;
}




export default function averageMetric(website : Website) : WebsiteStats {
    const ticks = website.websiteTick;
    const totalTicks = ticks.length;



    const mid = Math.floor(totalTicks / 2);
    const recent = ticks.slice(mid);
    const past = ticks.slice(0,mid);

    const calcAvg = (arr : typeof ticks,key : keyof WebsiteTick) =>
        arr.reduce((acc,t) => acc + Number(t[key]),0) / arr.length || 0;

    if (totalTicks === 0) {
        return {
            uptimePercentage: 0,
            averageLatency: 0,
            averageConnectionTime: 0,
            averageDataTransfer: 0,
            deltas : {
                uptimePercentage: 0,
                averageLatency: 0,
                averageConnectionTime: 0,
                averageDataTransfer: 0,
            }
        };
    }

    const goodRecent = recent.filter(t => t.status === "GOOD").length;
    const goodPast = past.filter(t => t.status === "GOOD").length;

    const recentStats = {
        uptimePercentage: (goodRecent / recent.length) * 100,
        averageLatency: calcAvg(recent, "latency"),
        averageConnectionTime: calcAvg(recent, "connection"),
        averageDataTransfer: calcAvg(recent, "dataTransfer"),
    };

    const pastStats = {
        uptimePercentage: (goodPast / past.length) * 100,
        averageLatency: calcAvg(past, "latency"),
        averageConnectionTime: calcAvg(past, "connection"),
        averageDataTransfer: calcAvg(past, "dataTransfer"),
    };

    return {
        ...recentStats,
        deltas: {
            uptimePercentage: (recentStats.uptimePercentage - pastStats.uptimePercentage),
            averageLatency: (recentStats.averageLatency - pastStats.averageLatency),
            averageConnectionTime: (recentStats.averageConnectionTime - pastStats.averageConnectionTime),
            averageDataTransfer: (recentStats.averageDataTransfer - pastStats.averageDataTransfer),
        },
    };


}