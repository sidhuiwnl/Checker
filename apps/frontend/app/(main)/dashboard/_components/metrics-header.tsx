type Props = {
    url : string,
    status  : string
}

export default function MetricsHeader({ url,status } : Props){
    const modifiedUrl = new URL(url).hostname.replace(/^www\./, '');
    return(
        <div className="flex items-center gap-2 ml-7">
            <div
                className={`w-3 h-3 rounded-full ${
                    status === "GOOD"
                        ? "bg-green-400"
                        : status === "BAD"
                            ? "bg-yellow-400"
                            : "bg-red-400"
                }`}
            />
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium hover:underline"
            >
                {modifiedUrl}
            </a>

        </div>
    )
}