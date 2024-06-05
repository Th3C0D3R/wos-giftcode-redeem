import { InteractionResponseFlags, InteractionResponseType } from "discord-interactions";

export class ValidationException extends Error {
    public errorType: string;
    public status: number;
    constructor(public message: string, public statusNumber: number) {
        super(message);
        this.errorType = 'Validation'
        this.status = statusNumber
    }
}

export class UnhandledData extends Error {
    public errorType: string;
    public status: number;
    constructor(public message: string, public statusNumber: number) {
        super(message);
        this.errorType = "UnhandledData";
        this.status = statusNumber;
    }
}

export function returnInteraction(content: string) {
    return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: content,
            flags: InteractionResponseFlags.EPHEMERAL
        }
    }
}

export function returnAckn(content: string) {
    return {
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: content,
            flags: InteractionResponseFlags.EPHEMERAL
        }
    }
}