import { MessageI } from './MessageI';

export interface ChatI{
    title: string
    icon: string
    msgPreview: string
    isRead: boolean
    lastMsg: string
    msgs: Array<MessageI>
    telefonos: Array<string>
    emails: Array<string>
    isGroup: boolean
}
