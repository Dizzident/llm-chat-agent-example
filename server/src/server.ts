import { WebSocketServer, WebSocket } from 'ws';
import { Client, UserRole, WebSocketMessage } from './types';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

const clients = new Map<string, Client>();
const waitingChatbots: string[] = [];
const waitingUsers: string[] = [];

console.log(`WebSocket server running on port ${PORT}`);

wss.on('connection', (ws: WebSocket) => {
  const clientId = generateId();
  const client: Client = {
    id: clientId,
    ws: ws
  };
  
  clients.set(clientId, client);
  console.log(`Client ${clientId} connected`);

  ws.on('message', (data: Buffer) => {
    try {
      const message: WebSocketMessage = JSON.parse(data.toString());
      handleMessage(clientId, message);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    handleDisconnect(clientId);
  });

  ws.on('error', (error) => {
    console.error(`Client ${clientId} error:`, error);
  });
});

function handleMessage(clientId: string, message: WebSocketMessage) {
  const client = clients.get(clientId);
  if (!client) return;

  switch (message.type) {
    case 'role':
      handleRoleSelection(clientId, message.payload.role);
      break;
    
    case 'message':
      handleChatMessage(clientId, message.payload);
      break;
  }
}

function handleRoleSelection(clientId: string, role: UserRole) {
  const client = clients.get(clientId);
  if (!client) return;

  client.role = role;
  console.log(`Client ${clientId} selected role: ${role}`);

  if (role === 'chatbot') {
    waitingChatbots.push(clientId);
  } else {
    waitingUsers.push(clientId);
  }

  tryToPairClients();
}

function tryToPairClients() {
  while (waitingChatbots.length > 0 && waitingUsers.length > 0) {
    const chatbotId = waitingChatbots.shift()!;
    const userId = waitingUsers.shift()!;

    const chatbot = clients.get(chatbotId);
    const user = clients.get(userId);

    if (chatbot && user) {
      chatbot.partnerId = userId;
      user.partnerId = chatbotId;

      sendMessage(chatbot.ws, { type: 'paired' });
      sendMessage(user.ws, { type: 'paired' });

      console.log(`Paired chatbot ${chatbotId} with user ${userId}`);
    }
  }

  // Notify waiting clients
  [...waitingChatbots, ...waitingUsers].forEach(clientId => {
    const client = clients.get(clientId);
    if (client) {
      sendMessage(client.ws, { type: 'waiting' });
    }
  });
}

function handleChatMessage(clientId: string, payload: any) {
  const client = clients.get(clientId);
  if (!client || !client.partnerId) return;

  const partner = clients.get(client.partnerId);
  if (!partner) return;

  const message: WebSocketMessage = {
    type: 'message',
    payload: payload
  };

  sendMessage(partner.ws, message);
  console.log(`Message from ${clientId} to ${client.partnerId}`);
}

function handleDisconnect(clientId: string) {
  const client = clients.get(clientId);
  if (!client) return;

  console.log(`Client ${clientId} disconnected`);

  // Remove from waiting lists
  const chatbotIndex = waitingChatbots.indexOf(clientId);
  if (chatbotIndex > -1) {
    waitingChatbots.splice(chatbotIndex, 1);
  }

  const userIndex = waitingUsers.indexOf(clientId);
  if (userIndex > -1) {
    waitingUsers.splice(userIndex, 1);
  }

  // Notify partner if paired
  if (client.partnerId) {
    const partner = clients.get(client.partnerId);
    if (partner) {
      partner.partnerId = undefined;
      sendMessage(partner.ws, { type: 'partner-disconnected' });
      
      // Put partner back in waiting list
      if (partner.role === 'chatbot') {
        waitingChatbots.push(partner.id);
      } else if (partner.role === 'user') {
        waitingUsers.push(partner.id);
      }
    }
  }

  clients.delete(clientId);
}

function sendMessage(ws: WebSocket, message: WebSocketMessage) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}