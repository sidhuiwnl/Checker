export interface AlertOptions {
    to: string | string[];
    subject?: string;
    type?: string;
    monitorId?: string;
    url?: string;
    error?: string;
    timestamp?: string;
    html?: string;
    text?: string;
}

export interface EmailResponse {
    message: string;
    success: boolean;
    jobId? : string;
}

export interface QueueStatus {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
}



