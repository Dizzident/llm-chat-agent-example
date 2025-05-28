import React, { useState, useEffect } from 'react';
import './App.css';
import RoleSelector from './components/RoleSelector';
import ChatWindow from './components/ChatWindow';
import { UserRole } from './types';
import { WebSocketService } from './services/WebSocketService';

function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaired, setIsPaired] = useState(false);
  const [wsService, setWsService] = useState<WebSocketService | null>(null);

  useEffect(() => {
    if (role && !wsService) {
      const service = new WebSocketService(
        'ws://localhost:8080',
        role,
        setIsConnected,
        setIsPaired
      );
      setWsService(service);
      
      return () => {
        service.disconnect();
      };
    }
  }, [role, wsService]);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
  };

  if (!role) {
    return <RoleSelector onRoleSelect={handleRoleSelect} />;
  }

  return (
    <ChatWindow 
      role={role} 
      isConnected={isConnected}
      isPaired={isPaired}
      wsService={wsService!}
    />
  );
}

export default App;