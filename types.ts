
export enum Sender {
  USER = 'user',
  AI = 'ai',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
}

export interface Message {
  id: string;
  sender: Sender;
  type: MessageType;
  text?: string;
  imageUrl?: string;
  timestamp: string;
}
