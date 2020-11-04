import { ChatI } from './ChatI';
import { MessageI } from './MessageI';
export interface ReceivedMessageI{
    msg: MessageI
    isgroup: boolean
    title: string
    sender: string
    conv: ChatI
}
