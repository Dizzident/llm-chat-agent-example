export type UserRole = 'chatbot' | 'user';

export interface Message {
  id: string;
  text: string;
  sender: UserRole;
  timestamp: Date;
}

export interface WebSocketMessage {
  type: 'role' | 'message' | 'paired' | 'partner-disconnected' | 'waiting';
  payload?: any;
}