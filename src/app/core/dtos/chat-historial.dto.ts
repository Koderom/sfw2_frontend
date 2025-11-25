export interface ChatMessageDto {
    role: 'user' | 'assistant' | string;
    content: string;
    timestamp?: string;
}

export interface ChatHistoryDto {
    user_id: string;
    message_count: number;
    messages: ChatMessageDto[];
}
