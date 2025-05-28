# Human-Powered Chatbot Application

A real-time web application that allows two users to simulate a chatbot interaction, where one user acts as the "chatbot" and the other as the "interacting user."

## Features

- **Role Selection**: Users can choose to be either the chatbot or the interacting user
- **Real-time Communication**: Messages are exchanged instantly via WebSockets
- **Automatic Pairing**: Users are automatically paired with someone who has selected the complementary role
- **Responsive Chat Interface**: Clean, modern UI similar to popular chat applications
- **Connection Status**: Visual indicators for connection and pairing status
- **Graceful Disconnection Handling**: Users are notified when their partner disconnects

## Technology Stack

### Frontend
- React with TypeScript
- WebSocket API for real-time communication
- CSS for styling

### Backend
- Node.js with TypeScript
- WebSocket server using the `ws` library
- First-come, first-served pairing algorithm

## Prerequisites

- Node.js (v18.x or v20.x)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd llm-chat-agent-example
```

2. Install dependencies for both client and server:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

## Running the Application

You'll need to run both the server and client in separate terminal windows.

### Start the WebSocket Server

```bash
cd server
npm run dev
```

The server will start on port 8080.

### Start the React Client

In a new terminal:

```bash
cd client
npm start
```

The client will start on http://localhost:3000

## Development

### Building for Production

**Client:**
```bash
cd client
npm run build
```

**Server:**
```bash
cd server
npm run build
npm start
```

### Running Tests

**Client tests:**
```bash
cd client
npm test
```

**Server tests:**
```bash
cd server
npm test
```

## Project Structure

```
llm-chat-agent-example/
├── client/                    # React frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # UI components
│   │   │   ├── RoleSelector.tsx
│   │   │   └── ChatWindow.tsx
│   │   ├── services/         # WebSocket service
│   │   ├── App.tsx          # Main app component
│   │   └── types.ts         # TypeScript types
│   └── package.json
├── server/                   # Node.js backend
│   ├── src/
│   │   ├── server.ts        # WebSocket server
│   │   └── types.ts         # TypeScript types
│   └── package.json
├── tests/                    # Test files
│   ├── client/              # Frontend tests
│   └── server/              # Backend tests
└── .github/
    └── workflows/
        └── build-and-test.yml # CI/CD pipeline
```

## Usage

1. Open the application in your browser
2. Choose your role: "Be the Chatbot" or "Be the Interacting User"
3. Wait to be paired with another user who selected the opposite role
4. Once paired, you can start chatting in real-time
5. Messages from you appear on the right, messages from your partner appear on the left

## CI/CD

The project includes a GitHub Actions workflow that:
- Runs on push to main branch and on pull requests
- Tests on Node.js 18.x and 20.x
- Builds both client and server applications
- Runs all unit tests

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.