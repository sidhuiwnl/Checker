import {IconTrendingUp,IconTrendingDown} from "@tabler/icons-react";
import {CardAction,CardFooter} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

export default function TrendIndicator({ delta } : { delta : number}) {

    const isUp = delta >= 0;
    const Icon = isUp ? IconTrendingUp : IconTrendingDown;
    const trendText = isUp ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`;
    const description = isUp
        ? "Performance increasing"
        : "Performance decreasing";

    return (
        <>
            <CardAction className="ml-5">
                <Badge variant="outline">
                    <Icon className="size-4" />
                    {trendText}
                </Badge>
            </CardAction>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {description} <Icon className="size-4" />
                </div>
                <div className="text-muted-foreground">
                    {isUp ? "Improving metrics" : "Needs optimization"}
                </div>
            </CardFooter>
        </>
    )
}