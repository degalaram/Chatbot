# ChatGPT-Style Chat Application

## Overview

This is a ChatGPT-inspired conversational AI application built with a modern full-stack architecture. The application provides a clean, focused chat interface where users can have conversations with an AI assistant powered by OpenAI's API. The design emphasizes minimal distraction with a sidebar for chat history management and a centered conversation view.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React with TypeScript**: The application uses React 18+ with TypeScript for type-safe component development
- **Vite**: Build tool and development server providing fast hot module replacement (HMR) and optimized production builds
- **Wouter**: Lightweight client-side routing library (alternative to React Router) for navigation between chat sessions

**UI Component Strategy**
- **shadcn/ui**: Component library built on Radix UI primitives with Tailwind CSS styling
- **Design System**: Custom theme based on ChatGPT's interface combined with Material Design principles
- **Typography**: Primary font stack using 'Inter' or 'SF Pro Display' via Google Fonts, with 'Fira Code' for code blocks
- **Responsive Layout**: 
  - Desktop: Fixed sidebar (260px) + flexible chat area
  - Tablet/Mobile: Collapsible overlay sidebar with full-width chat
  - Content max-width of 3xl (768px) for optimal readability

**State Management**
- **TanStack Query (React Query)**: Handles all server state management, caching, and data synchronization
- **Local React State**: Used for UI-specific state (input values, sidebar toggle, etc.)
- **Custom Hooks**: `useToast` for notifications, `useIsMobile` for responsive behavior, `useTheme` for dark/light mode

**Key UI Components**
- `AppSidebar`: Chat history navigation with new chat button
- `MessageBubble`: Displays individual messages with role-based styling (user vs assistant)
- `ChatInput`: Auto-resizing textarea with attachment and voice input buttons
- `EmptyState`: Welcome screen with suggestion chips
- `ThemeProvider`: Light/dark mode support with localStorage persistence

### Backend Architecture

**Server Framework**
- **Express.js**: Node.js web framework handling HTTP requests and middleware
- **TypeScript with ESM**: Modern JavaScript modules for better code organization
- **Custom Vite Integration**: Development server with middleware mode for seamless HMR during development

**API Design Pattern**
- **RESTful API**: Simple REST endpoints for chat and message operations
- **Route Structure**:
  - `GET /api/chats` - Retrieve all chat sessions
  - `POST /api/chats` - Create new chat session
  - `GET /api/chats/:chatId/messages` - Fetch messages for specific chat
  - `POST /api/chats/:chatId/messages` - Send message and get AI response
  - `PATCH /api/chats/:chatId` - Update chat title

**Data Validation**
- **Zod**: Runtime type validation for request/response payloads
- **Drizzle-Zod Integration**: Schema validation derived from database models ensuring consistency

**Storage Layer**
- **Storage Interface (IStorage)**: Abstraction layer allowing pluggable storage implementations
- **MemStorage**: In-memory storage implementation for development/testing
- **Database-Ready**: Structure supports easy migration to PostgreSQL via Drizzle ORM

**Request/Response Flow**
1. Client sends request through `apiRequest` utility function
2. Express middleware validates JSON and logs requests
3. Route handler validates input with Zod schemas
4. Storage layer performs data operations
5. Response sent with appropriate HTTP status codes
6. React Query caches response and updates UI

### Data Storage Solutions

**ORM & Schema Management**
- **Drizzle ORM**: TypeScript-first ORM with excellent type inference
- **PostgreSQL Dialect**: Configured for PostgreSQL (via Neon Database serverless driver)
- **Migration System**: Drizzle Kit handles schema migrations in `./migrations` directory

**Database Schema**
- **Users Table**: Authentication data (id, username, password)
- **Chats Table**: Chat sessions (id, title, createdAt)
- **Messages Table**: Individual messages (id, chatId, role, content, createdAt)
  - Foreign key relationship: messages.chatId → chats.id
  - Role field distinguishes between "user" and "assistant" messages

**Type Safety**
- Shared schema types exported from `@shared/schema`
- Insert schemas for validation (InsertUser, InsertChat, InsertMessage)
- Select types inferred from Drizzle schema (User, Chat, Message)

**Storage Pattern**
- Currently uses in-memory storage (MemStorage) with Map data structures
- Interface-based design allows swapping to database implementation without changing business logic
- UUID generation for entity IDs using crypto.randomUUID()

### Authentication and Authorization

**Current State**: No authentication implemented in the current codebase

**Prepared Infrastructure**:
- User schema exists with username/password fields
- Storage interface includes user CRUD operations
- Session management library included (`connect-pg-simple`) but not configured

**Future Implementation Path**: The architecture supports adding authentication by:
1. Implementing session middleware with PostgreSQL session store
2. Adding login/register endpoints
3. Associating chats with user IDs
4. Adding authorization checks to chat/message routes

### External Dependencies

**AI Service Integration**
- **OpenAI API**: Primary AI provider for chat completions
  - Configured via `OPENAI_API_KEY` environment variable
  - OpenAI client instantiated in routes handler
  - Used for generating assistant responses to user messages

**Database Service**
- **Neon Database**: Serverless PostgreSQL platform
  - Connection via `@neondatabase/serverless` driver
  - Connection string configured through `DATABASE_URL` environment variable
  - Supports HTTP-based database queries for serverless environments

**UI Component Libraries**
- **Radix UI**: Headless component primitives (20+ components)
  - Accordion, Dialog, Dropdown, Popover, Tooltip, and more
  - Provides accessible, unstyled components
  - Customized with Tailwind CSS for ChatGPT-style appearance

**Styling & Design**
- **Tailwind CSS**: Utility-first CSS framework
  - Custom theme configuration with HSL color variables
  - Custom spacing primitives (2, 3, 4, 6, 8 units)
  - Dark mode support via class strategy
- **Google Fonts**: Typography via CDN
  - Inter/SF Pro Display for UI text
  - Fira Code for code blocks
  - Geist Mono as alternative monospace option

**Development Tools**
- **Replit-Specific Plugins**:
  - `@replit/vite-plugin-runtime-error-modal`: Error overlay for development
  - `@replit/vite-plugin-cartographer`: Code navigation enhancement
  - `@replit/vite-plugin-dev-banner`: Development environment indicator

**Form & Validation**
- **React Hook Form**: Form state management
- **@hookform/resolvers**: Integration layer for validation libraries
- **Zod**: Schema validation for forms and API payloads

**Utility Libraries**
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional className composition
- **class-variance-authority**: Variant-based component styling
- **nanoid**: Compact unique ID generation