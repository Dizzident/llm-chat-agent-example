import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatWindow from '../../../client/src/components/ChatWindow';
import { WebSocketService } from '../../../client/src/services/WebSocketService';

jest.mock('../../../client/src/services/WebSocketService');

describe('ChatWindow', () => {
  let mockWsService: jest.Mocked<WebSocketService>;

  beforeEach(() => {
    mockWsService = {
      sendMessage: jest.fn(),
      onMessage: jest.fn(),
      disconnect: jest.fn(),
    } as any;
  });

  it('displays connecting status when not connected', () => {
    render(
      <ChatWindow 
        role="user" 
        isConnected={false} 
        isPaired={false}
        wsService={mockWsService}
      />
    );
    
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('displays waiting status when connected but not paired', () => {
    render(
      <ChatWindow 
        role="user" 
        isConnected={true} 
        isPaired={false}
        wsService={mockWsService}
      />
    );
    
    expect(screen.getByText('Waiting for partner...')).toBeInTheDocument();
  });

  it('displays connected status when paired', () => {
    render(
      <ChatWindow 
        role="chatbot" 
        isConnected={true} 
        isPaired={true}
        wsService={mockWsService}
      />
    );
    
    expect(screen.getByText('Connected as Chatbot')).toBeInTheDocument();
  });

  it('shows chat prompt when paired with no messages', () => {
    render(
      <ChatWindow 
        role="user" 
        isConnected={true} 
        isPaired={true}
        wsService={mockWsService}
      />
    );
    
    expect(screen.getByText('What can I help with?')).toBeInTheDocument();
  });

  it('disables input when not paired', () => {
    render(
      <ChatWindow 
        role="user" 
        isConnected={true} 
        isPaired={false}
        wsService={mockWsService}
      />
    );
    
    const input = screen.getByPlaceholderText('Ask anything');
    expect(input).toBeDisabled();
  });

  it('enables input when paired', () => {
    render(
      <ChatWindow 
        role="user" 
        isConnected={true} 
        isPaired={true}
        wsService={mockWsService}
      />
    );
    
    const input = screen.getByPlaceholderText('Ask anything');
    expect(input).not.toBeDisabled();
  });

  it('sends message when send button is clicked', () => {
    render(
      <ChatWindow 
        role="user" 
        isConnected={true} 
        isPaired={true}
        wsService={mockWsService}
      />
    );
    
    const input = screen.getByPlaceholderText('Ask anything');
    const sendButton = screen.getByText('Send');
    
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);
    
    expect(mockWsService.sendMessage).toHaveBeenCalledWith('Hello');
  });

  it('sends message when Enter key is pressed', () => {
    render(
      <ChatWindow 
        role="user" 
        isConnected={true} 
        isPaired={true}
        wsService={mockWsService}
      />
    );
    
    const input = screen.getByPlaceholderText('Ask anything');
    
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.keyPress(input, { key: 'Enter', charCode: 13 });
    
    expect(mockWsService.sendMessage).toHaveBeenCalledWith('Hello');
  });

  it('clears input after sending message', () => {
    render(
      <ChatWindow 
        role="user" 
        isConnected={true} 
        isPaired={true}
        wsService={mockWsService}
      />
    );
    
    const input = screen.getByPlaceholderText('Ask anything') as HTMLInputElement;
    const sendButton = screen.getByText('Send');
    
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);
    
    expect(input.value).toBe('');
  });
});