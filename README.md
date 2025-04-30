# DeFather AI Assistant Platform

![DeFather Logo](public/defather.png)

## Overview

DeFather is an innovative AI assistant platform built on the Rootstock blockchain technology, designed to provide interactive guidance and support for blockchain developers and enthusiasts. The platform features an intelligent chat interface with contextual understanding and an interactive step-by-step guide that adapts to the user's learning pace.

## Key Features

- **Intelligent AI Assistant**: Conversational interface with deep understanding of blockchain concepts
- **Interactive Guide System**: Progressive learning experience with adaptive content
- **Real-time Navigation**: Seamless section transitions with visual feedback
- **Context-aware Responses**: Assistant remembers conversation history to provide relevant information
- **Modern UI**: Clean, responsive design with dark mode support
- **Tailored Learning Path**: Customized content based on user interaction patterns

## Technologies Used

### Frontend
- **React**: Core library for building the user interface
- **TypeScript**: Type-safe programming language
- **TailwindCSS**: Utility-first CSS framework for styling
- **React Router**: Navigation and routing management
- **Context API**: State management across components

### Development Tools
- **Windsurf IDE**: AI-powered integrated development environment that accelerated the development process
- **Vite**: Fast, modern frontend build tool
- **ESLint**: Code quality and style enforcement
- **Node.js**: JavaScript runtime for development

### Architecture
- **Component-based Structure**: Modular design for reusability and maintainability
- **Context Providers**: Global state management for chat and guide functionality
- **Adaptive Content System**: Dynamic content delivery based on user progress

## Project Structure

```

├── public/           # Static assets
├── src/              # Source code
│   ├── components/   # Reusable UI components
│   ├── context/      # Application state management
│   │   ├── ChatContext.tsx   # Chat functionality state
│   │   └── GuideContext.tsx  # Interactive guide state
│   ├── data/         # Content data and types
│   ├── pages/        # Application pages
│   │   ├── Home.tsx           # Landing page with chat
│   │   └── interactive/       # Interactive guide pages
│   │       └── DeFatherGuide.tsx  # Main guide component
│   ├── styles/       # Global styles
│   └── main.tsx      # Application entry point
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## Key Components

### Chat System
The chat system provides an intuitive interface for users to interact with the AI assistant. It supports:
- Command suggestions for common questions
- Context-aware responses
- Conversation history

### Interactive Guide
The guide system features:
- Progressive unlocking of content sections
- Visual navigation with animation feedback
- In-depth explanations with code examples
- Mini-map for quick section navigation

## Development Process

This project was developed using the cutting-edge Windsurf IDE, an AI-powered development environment that streamlined the coding process. Windsurf IDE provided:

- Intelligent code suggestions and completion
- Real-time project structure optimization
- Integrated debugging and problem-solving
- Automated testing and refactoring recommendations

The development workflow utilized a context-aware approach to ensure that all components worked seamlessly together, with special attention to the interactive elements and user experience.

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/defather-platform.git
cd defather-platform/client
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Rootstock blockchain for providing the underlying technology
- The Windsurf team for their excellent AI-powered development tools
- All contributors who participated in this hackathon project
