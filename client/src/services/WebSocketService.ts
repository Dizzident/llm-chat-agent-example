import { UserRole, Message, WebSocketMessage } from '../types';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandler: ((message: Message) => void) | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  
  constructor(
    private url: string,
    private role: UserRole,
    private onConnectionChange: (connected: boolean) => void,
    private onPairingChange: (paired: boolean) => void
  ) {
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.onConnectionChange(true);
        this.sendRole();
      };

      this.ws.onmessage = (event) => {
        const data: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(data);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.onConnectionChange(false);
        this.onPairingChange(false);
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    this.reconnectTimeout = setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.connect();
    }, 3000);
  }

  private sendRole() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: 'role',
        payload: { role: this.role }
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  private handleMessage(data: WebSocketMessage) {
    switch (data.type) {
      case 'paired':
        this.onPairingChange(true);
        break;
      
      case 'waiting':
        this.onPairingChange(false);
        break;
      
      case 'partner-disconnected':
        this.onPairingChange(false);
        break;
      
      case 'message':
        if (this.messageHandler && data.payload) {
          const message: Message = {
            id: Date.now().toString(),
            text: data.payload.text,
            sender: data.payload.sender,
            timestamp: new Date()
          };
          this.messageHandler(message);
        }
        break;
    }
  }

  sendMessage(text: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: 'message',
        payload: { text, sender: this.role }
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  onMessage(handler: (message: Message) => void) {
    this.messageHandler = handler;
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
    }
  }
}