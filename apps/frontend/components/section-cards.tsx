import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import averageMetric from "@/lib/avg-metric";
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import useWebsite from "@/hooks/useWebsite";
import TrendIndicator from "@/components/TrendIndicator";

export function SectionCards({ currentWebsiteId }: { currentWebsiteId : string }) {
  const data = useWebsite(currentWebsiteId);

  if(!data){
    return null
  }
  const { averageConnectionTime,averageDataTransfer,uptimePercentage,averageLatency,deltas } = averageMetric(data);


  return (
      <div className="grid grid-cols-1 gap-4 px-4 bg-neutral-950 text-white lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Uptime Percentage</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {uptimePercentage.toFixed(2)} %
            </CardTitle>
          </CardHeader>
          <TrendIndicator delta={deltas.uptimePercentage}/>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Avg Data Transfer</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {averageDataTransfer.toFixed(2)}
            </CardTitle>
            <CardAction>
              
            </CardAction>
          </CardHeader>
          <TrendIndicator delta={deltas.averageDataTransfer}/>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Avg latency</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {averageLatency.toFixed(2)}
            </CardTitle>
            <CardAction>
              
            </CardAction>
          </CardHeader>
         <TrendIndicator delta={deltas.averageLatency}/>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Avg ConnectionTime</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {averageConnectionTime.toFixed(2)}
            </CardTitle>
            <CardAction>
              
            </CardAction>
          </CardHeader>
          <TrendIndicator delta={deltas.averageConnectionTime}/>
        </Card>
      </div>
  )
}
