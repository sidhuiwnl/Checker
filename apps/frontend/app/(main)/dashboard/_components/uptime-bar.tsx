interface UptimeBarProps {
    data: Array<"up" | "down" | "unknown">
    className?: string
}

export function UptimeBar({ data, className = "" }: UptimeBarProps) {
    return (
        <div className={`flex h-3 w-full gap-0.5 ${className}`}>
            {data.map((status, index) => (
                <div
                    key={index}
                    className={`flex-1 rounded-sm ${
                        status === "up"
                            ? "bg-green-500 dark:bg-green-600"
                            : status === "down"
                                ? "bg-red-500 dark:bg-red-600"
                                : "bg-gray-200 dark:bg-gray-700"
                    }`}
                    title={`${status.charAt(0).toUpperCase() + status.slice(1)} at period ${index + 1}`}
                />
            ))}
        </div>
    )
}

