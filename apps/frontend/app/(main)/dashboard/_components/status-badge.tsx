import { CheckCircle, XCircle } from "lucide-react"

interface StatusBadgeProps {
    status: "up" | "down"
}

export function StatusBadge({ status }: StatusBadgeProps) {
    if (status === "up") {
        return (
            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs font-medium">Up</span>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-1.5 text-red-600 dark:text-red-500">
            <XCircle className="h-4 w-4" />
            <span className="text-xs font-medium">Down</span>
        </div>
    )
}

