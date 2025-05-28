import React, { useState, useEffect, useRef } from 'react';
import { UserRole, Message } from '../types';
import { WebSocketService } from '../services/WebSocketService';
import './ChatWindow.css';

interface ChatWindowProps {
  role: UserRole;
  isConnected: boolean;
  isPaired: boolean;
  wsService: WebSocketService;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  role, 
  isConnected, 
  isPaired,
  wsService 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    wsService.onMessage((message: Message) => {
      setMessages(prev => [...prev, message]);
    });
  }, [wsService]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() && isPaired) {
      wsService.sendMessage(inputText);
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        sender: role,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getStatusText = () => {
    if (!isConnected) return 'Connecting...';
    if (!isPaired) return 'Waiting for partner...';
    return `Connected as ${role === 'chatbot' ? 'Chatbot' : 'User'}`;
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="status">
          <div className={`status-indicator ${isPaired ? 'connected' : 'waiting'}`} />
          <span>{getStatusText()}</span>
        </div>
      </div>
      
      <div className="chat-container">
        {messages.length === 0 && isPaired && (
          <div className="chat-prompt">What can I help with?</div>
        )}
        
        <div className="messages-container">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.sender === role ? 'own' : 'other'}`}
            >
              <div className="message-bubble">
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask anything"
          disabled={!isPaired}
          className="message-input"
        />
        <button 
          onClick={handleSend} 
          disabled={!isPaired || !inputText.trim()}
          className="send-button"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;