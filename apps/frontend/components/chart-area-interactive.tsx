"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import useWebsite from "@/hooks/useWebsite";

const chartConfig = {
  visitors: {
    label: "Total",
  },
  connection: {
    label: "Connection",
    color: "oklch(48.8% 0.243 264.376)",
  },
  latency: {
    label: "Latency",
    color: "oklch(43.2% 0.095 166.913)",
  },
  total: {
    label: "Total",
    color: "oklch(68.1% 0.162 75.834)",
  },
  tlsHandshake: {
    label: "TLSHandshake",
    color: "oklch(85.5% 0.138 181.071)",
  },
  dataTransfer: {
    label: "Data Transfer",
    color: "oklch(64.5% 0.246 16.439)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ monitorId } : { monitorId: string }) {
  const currentWebsiteChartData = useWebsite(monitorId);
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const formattedWebsiteChartData = React.useMemo(() => {
    if (!currentWebsiteChartData?.websiteTick) return [];

    return currentWebsiteChartData.websiteTick.map(item => {
      return {
        ...item,
        date: item.createdAt.split('T')[0], // Extract just the date part
        // Keep the original fields but also include them with the names expected by the chart
        connection: item.connection,
        latency: item.latency,
        total: item.total,
        dataTransfer : item.dataTransfer,
        tlsHandshake : item.tlsHandshake,
      };
    });
  }, [currentWebsiteChartData]);

  const filteredData = React.useMemo(() => {
    if (formattedWebsiteChartData.length === 0) return [];

    const today = new Date();

    if (timeRange === "Today") {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const todayData = formattedWebsiteChartData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startOfToday;
      });

      // Return empty array if no data for today
      return todayData;
    }

    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return formattedWebsiteChartData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate;
    });
  }, [formattedWebsiteChartData, timeRange]);

  return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Website Performance</CardTitle>
          <CardDescription>
          <span className="hidden @[540px]/card:block">
            Connection and latency metrics for the last {timeRange === "90d" ? "3 months" : timeRange === "30d" ? "30 days" : timeRange === "7d" ? "7 days" : "24 hours"}
          </span>
            <span className="@[540px]/card:hidden">Last {timeRange === "90d" ? "3 months" : timeRange === "30d" ? "30 days" : timeRange === "7d" ? "7 days" : "24 hours"}</span>
          </CardDescription>
          <CardAction>
            <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={setTimeRange}
                variant="outline"
                className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
              <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
              <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
              <ToggleGroupItem value="Today">Today</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                  className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                  size="sm"
                  aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
                <SelectItem value="Today" className="rounded-lg">
                  Today
                </SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
          >
            { filteredData.length > 0 ? (
                <AreaChart data={filteredData}>
                  <defs>
                    <linearGradient id="fillConnection" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-connection)" stopOpacity={1.0} />
                      <stop offset="95%" stopColor="var(--color-connection)" stopOpacity={0.1} />
                    </linearGradient>

                    <linearGradient id="fillLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-latency)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-latency)" stopOpacity={0.1} />
                    </linearGradient>

                    <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.1} />
                    </linearGradient>

                    <linearGradient id="fillDataTransfer" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-dataTransfer)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-dataTransfer)" stopOpacity={0.1} />
                    </linearGradient>

                    <linearGradient id="fillTLSHandshake" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-tlsHandshake)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-tlsHandshake)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid vertical={false} />
                  <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                  />
                  <ChartTooltip
                      cursor={false}
                      defaultIndex={isMobile ? -1 : (filteredData.length > 0 ? Math.min(10, filteredData.length - 1) : undefined)}
                      content={
                        <ChartTooltipContent
                            labelFormatter={(value) => {
                              return new Date(value).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            }}
                            indicator="dot"
                        />
                      }
                  />
                  <Area
                      dataKey="connection"
                      type="natural"
                      fill="url(#fillConnection)"
                      stroke="var(--color-connection)"
                      stackId="a"
                  />
                  <Area
                      dataKey="latency"
                      type="natural"
                      fill="url(#fillLatency)"
                      stroke="var(--color-latency)"
                      stackId="b"
                  />
                  <Area
                      dataKey="total"
                      type="natural"
                      fill="url(#fillTotal)"
                      stroke="var(--color-total)"
                      stackId="c"
                  />
                  <Area
                      dataKey="dataTransfer"
                      type="natural"
                      fill="url(#fillDataTransfer)"
                      stroke="var(--color-dataTransfer)"
                      stackId="d"
                  />
                  <Area
                      dataKey="tlsHandshake"
                      type="natural"
                      fill="url(#fillTLSHandshake)"
                      stroke="var(--color-tlsHandshake)"
                      stackId="e"
                  />
                </AreaChart>
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                <p className="text-lg text-muted-foreground">No data available for the selected time period</p>
                </div>
              )
            }

          </ChartContainer>
        </CardContent>
      </Card>
  )
}