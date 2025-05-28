import { WebSocket } from 'ws';

export type UserRole = 'chatbot' | 'user';

export interface Client {
  id: string;
  ws: WebSocket;
  role?: UserRole;
  partnerId?: string;
}

export interface WebSocketMessage {
  type: 'role' | 'message' | 'paired' | 'partner-disconnected' | 'waiting';
  payload?: any;
}