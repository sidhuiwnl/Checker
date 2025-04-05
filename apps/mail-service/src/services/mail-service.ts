export type NotificationType =
    | 'monitor-down'
    | 'monitor-up'
    | 'high-latency'
    | 'monitor-created'
    | 'weekly-report';

export interface NotificationOptions {
    type: NotificationType;
    data: Record<string, any>;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
}

import type {MailProvider,EmailOptions} from "./mail-interface.ts";
