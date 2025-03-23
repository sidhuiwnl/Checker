
import {ChartParent} from "@/app/(main)/dashboard/[monitor]/_components/area-chart-monitor";

interface Props {
    params: { monitor : string };
}


export default async function Page({ params }: Props){
    const { monitor } = await params;
    return (
        <div className="flex flex-col h-screen w-screen items-center justify-center">
           <ChartParent monitor={monitor} />
        </div>
    )
}