import React from 'react';
import { UserRole } from '../types';
import './RoleSelector.css';

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  return (
    <div className="role-selector">
      <h1>Choose Your Role</h1>
      <div className="role-buttons">
        <button 
          className="role-button chatbot"
          onClick={() => onRoleSelect('chatbot')}
        >
          Be the Chatbot
        </button>
        <button 
          className="role-button user"
          onClick={() => onRoleSelect('user')}
        >
          Be the Interacting User
        </button>
      </div>
    </div>
  );
};

export default RoleSelector;