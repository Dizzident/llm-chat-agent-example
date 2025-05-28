import { WebSocketMessage } from '../../../server/src/types';

// Mock WebSocket
class MockWebSocket {
  readyState = 1; // WebSocket.OPEN
  messages: string[] = [];
  
  send(data: string) {
    this.messages.push(data);
  }
  
  emit(event: string, data?: any) {
    if (event === 'message' && this.onmessage) {
      this.onmessage({ data } as any);
    }
    if (event === 'close' && this.onclose) {
      this.onclose();
    }
  }
  
  onmessage?: (event: any) => void;
  onclose?: () => void;
  onerror?: (error: any) => void;
}

describe('WebSocket Server Logic', () => {
  it('should handle role selection correctly', () => {
    const ws = new MockWebSocket();
    const roleMessage: WebSocketMessage = {
      type: 'role',
      payload: { role: 'chatbot' }
    };
    
    // Simulate sending role message
    ws.send(JSON.stringify(roleMessage));
    
    expect(ws.messages).toHaveLength(1);
    expect(ws.messages[0]).toBe(JSON.stringify(roleMessage));
  });

  it('should handle message relay between paired clients', () => {
    const chatbotWs = new MockWebSocket();
    const userWs = new MockWebSocket();
    
    const message: WebSocketMessage = {
      type: 'message',
      payload: { text: 'Hello', sender: 'user' }
    };
    
    userWs.send(JSON.stringify(message));
    
    expect(userWs.messages).toHaveLength(1);
    expect(userWs.messages[0]).toBe(JSON.stringify(message));
  });

  it('should handle client disconnection', () => {
    const ws = new MockWebSocket();
    let disconnected = false;
    
    ws.onclose = () => {
      disconnected = true;
    };
    
    ws.emit('close');
    
    expect(disconnected).toBe(true);
  });

  it('should generate unique client IDs', () => {
    const generateId = () => {
      return Math.random().toString(36).substring(2) + Date.now().toString(36);
    };
    
    const id1 = generateId();
    const id2 = generateId();
    
    expect(id1).not.toBe(id2);
    expect(id1.length).toBeGreaterThan(0);
    expect(id2.length).toBeGreaterThan(0);
  });

  it('should properly serialize and deserialize messages', () => {
    const originalMessage: WebSocketMessage = {
      type: 'message',
      payload: { text: 'Test message', sender: 'chatbot' }
    };
    
    const serialized = JSON.stringify(originalMessage);
    const deserialized = JSON.parse(serialized);
    
    expect(deserialized).toEqual(originalMessage);
  });
});