export interface SignupIncomingMessage {
    ip: string;
    signedMessage: string;
    callbackId: string;
    location: string;
}

export interface SignupOutgoingMessage {
    ip : string;
    location : string;
    callbackId : string
    validatorId : string
}

export interface ValidateIncomingMessage {
    callbackId: string;
    status: 'GOOD' | 'BAD';
    latency: number;
    websiteId: string;
    validatorId: string;
    dataTransfer : number,
    TLShandshake : number,
    connection : number,
    total : number,
}

export interface ValidateOutgoingMessage {
    url: string,
    callbackId: string,
    websiteId: string;
}

export type IncomingMessage = {
    type: 'signup'
    data: SignupIncomingMessage
} | {
    type: 'validate'
    data: ValidateIncomingMessage
}

export type OutgoingMessage = {
    type: 'signup'
    data: SignupOutgoingMessage
} | {
    type: 'validate'
    data: ValidateOutgoingMessage
}

export interface ValidationResult {
    callbackId: string;
    status: 'GOOD' | 'BAD';
    latency: number;
    websiteId: string;
    validatorId: string | null;
    dataTransfer?: number;
    TLShandshake?: number;
    connection?: number;
    total?: number;
}

