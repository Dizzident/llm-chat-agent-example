import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RoleSelector from '../../../client/src/components/RoleSelector';
import { UserRole } from '../../../client/src/types';

describe('RoleSelector', () => {
  it('renders the role selection heading', () => {
    const mockOnRoleSelect = jest.fn();
    render(<RoleSelector onRoleSelect={mockOnRoleSelect} />);
    
    expect(screen.getByText('Choose Your Role')).toBeInTheDocument();
  });

  it('renders both role buttons', () => {
    const mockOnRoleSelect = jest.fn();
    render(<RoleSelector onRoleSelect={mockOnRoleSelect} />);
    
    expect(screen.getByText('Be the Chatbot')).toBeInTheDocument();
    expect(screen.getByText('Be the Interacting User')).toBeInTheDocument();
  });

  it('calls onRoleSelect with "chatbot" when chatbot button is clicked', () => {
    const mockOnRoleSelect = jest.fn();
    render(<RoleSelector onRoleSelect={mockOnRoleSelect} />);
    
    const chatbotButton = screen.getByText('Be the Chatbot');
    fireEvent.click(chatbotButton);
    
    expect(mockOnRoleSelect).toHaveBeenCalledWith('chatbot');
  });

  it('calls onRoleSelect with "user" when user button is clicked', () => {
    const mockOnRoleSelect = jest.fn();
    render(<RoleSelector onRoleSelect={mockOnRoleSelect} />);
    
    const userButton = screen.getByText('Be the Interacting User');
    fireEvent.click(userButton);
    
    expect(mockOnRoleSelect).toHaveBeenCalledWith('user');
  });
});