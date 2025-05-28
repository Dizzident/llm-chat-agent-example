# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

This is a Human-Powered Chatbot Application that allows two users to simulate a chatbot interaction via WebSockets.

## Current Configuration

- Git repository initialized
- Claude permissions configured to allow `find`, `ls`, and `mkdir` bash commands (see `.claude/settings.local.json`)
- Full-stack TypeScript application with React frontend and Node.js backend

## Development Setup

1. Install dependencies:
   ```bash
   # Client
   cd client && npm install
   
   # Server
   cd server && npm install
   ```

2. Run development servers:
   ```bash
   # Terminal 1 - Server (port 8080)
   cd server && npm run dev
   
   # Terminal 2 - Client (port 3000)
   cd client && npm start
   ```

## Commands

### Client Commands
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Server Commands
- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript
- `npm start` - Run production server
- `npm test` - Run tests

## Architecture

### Frontend (React + TypeScript)
- **Components**: RoleSelector and ChatWindow in `client/src/components/`
- **WebSocket Service**: Handles real-time communication in `client/src/services/WebSocketService.ts`
- **Styling**: Dark theme matching the provided UI mockup

### Backend (Node.js + TypeScript)
- **WebSocket Server**: Manages connections and message routing in `server/src/server.ts`
- **Pairing Logic**: First-come, first-served pairing of chatbot and user roles
- **Connection Management**: Handles disconnections and re-pairing

### Testing
- Client tests use React Testing Library and Jest
- Server tests use Jest with TypeScript
- GitHub Actions CI/CD pipeline runs on Node.js 18.x and 20.x