export interface MessageI{
    content: string
    time: Date
    isRead: boolean
    owner?: string
    isMe: boolean
}
