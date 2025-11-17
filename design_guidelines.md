# ChatGPT-Style Chat Application Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from ChatGPT's interface combined with Material Design principles for the chat experience. This productivity-focused application prioritizes clarity, efficiency, and seamless conversation flow.

**Key Design Principles**:
- Minimal distraction: Clean, focused interface that keeps attention on the conversation
- Hierarchy through typography and spacing rather than heavy visual treatments
- Smooth, purposeful interactions with minimal animation
- Information density balanced with breathing room

## Typography

**Font Stack**: 
- Primary: 'Inter' or 'SF Pro Display' via Google Fonts CDN
- Monospace: 'Fira Code' for code blocks within messages

**Hierarchy**:
- Page title/branding: text-lg font-semibold
- Chat message content: text-base font-normal leading-relaxed
- Timestamps: text-xs font-normal
- Sidebar chat titles: text-sm font-medium
- User input: text-base font-normal
- Button labels: text-sm font-medium

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 3, 4, 6, and 8 for consistency
- Component padding: p-3 to p-4
- Section spacing: space-y-4 to space-y-6
- Message gaps: gap-6 for vertical message spacing
- Sidebar item spacing: space-y-2

**Grid Structure**:
- Desktop: Sidebar (260px fixed) + Main chat area (flex-1)
- Tablet: Collapsible overlay sidebar + Full-width chat
- Mobile: Hidden sidebar (hamburger menu) + Full-width chat

**Container Strategy**:
- Chat messages: max-w-3xl mx-auto (centered content column)
- Sidebar: fixed width without max constraints
- Input area: full-width with max-w-3xl inner container

## Component Library

### Navigation & Sidebar

**Sidebar Component**:
- Fixed left sidebar on desktop (w-64)
- Collapsible overlay on tablet/mobile
- Top section: New chat button + branding
- Middle section: Scrollable chat history list
- Bottom section: Theme toggle + user menu

**Chat History Items**:
- Compact list items with truncated text (truncate)
- Hover state for selection
- Active chat indicator
- Delete/rename actions on hover

### Chat Interface

**Message Container**:
- Alternating message alignment approach: All messages in single column, distinguished by subtle styling differences
- User messages: Slightly different treatment
- AI messages: Default treatment
- Avatar icons: Small circular icons (w-8 h-8) for both user and AI
- Message spacing: gap-6 between messages

**Message Bubble Design**:
- Full-width containers without traditional bubbles
- Subtle rounded corners (rounded-lg)
- Padding: p-4 to p-6 for message content
- Avatar + content in flex row layout

**Input Area**:
- Fixed bottom position on mobile
- Sticky bottom on desktop
- Multi-line textarea with auto-resize (max 200px height)
- Send button integrated on the right
- Rounded container (rounded-2xl) with border
- Padding: p-3 interior spacing

### Theme Toggle

**Theme Switcher**:
- Icon-based toggle (sun/moon icons from Heroicons)
- Located in sidebar footer
- Smooth transition on toggle (transition-colors duration-200)
- Persists preference to localStorage

### Buttons & Actions

**Primary Actions**:
- New Chat: Full-width button in sidebar top, rounded-lg, p-3
- Send: Circular or pill-shaped button, p-2 to p-3
- Menu Toggle: Icon button for mobile, p-2

**Secondary Actions**:
- Chat history items: Subtle hover treatment
- Delete/edit: Small icon buttons appearing on hover

### Icons

**Icon Library**: Heroicons (outline for inactive, solid for active states)
- New chat: PlusIcon
- Menu toggle: Bars3Icon
- Theme: SunIcon/MoonIcon
- Send: PaperAirplaneIcon
- User avatar: UserCircleIcon
- AI avatar: SparklesIcon or custom logo

## Responsive Behavior

**Breakpoints**:
- Mobile: < 768px - Hidden sidebar, hamburger menu, full-width chat, fixed input
- Tablet: 768px - 1024px - Overlay sidebar, optimized message width
- Desktop: > 1024px - Persistent sidebar, centered message column

**Mobile Optimizations**:
- Collapsible sidebar with overlay backdrop
- Larger touch targets (min-h-12 for buttons)
- Input area: Fixed to bottom with safe area insets
- Message padding reduced: p-3 instead of p-6
- Simplified navigation with hamburger menu

**Desktop Enhancements**:
- Persistent visible sidebar
- Hover states for all interactive elements
- Wider message containers (max-w-3xl)
- More generous spacing throughout

## Accessibility

- Keyboard navigation for all interactive elements
- ARIA labels for icon-only buttons
- Focus visible indicators (focus:ring-2)
- Sufficient contrast ratios for text
- Screen reader announcements for new messages
- Theme preference respects system prefers-color-scheme

## Animation Guidelines

**Minimal, Purposeful Motion**:
- Theme transitions: transition-colors duration-200
- Sidebar toggle: transform transition duration-300
- Message appearance: Simple fade-in (opacity transition)
- NO scroll-driven animations
- NO complex message animations
- Focus on instant responsiveness over decorative motion

## Images

**No hero images needed** - This is a utility application focused on conversation. The only imagery:
- User/AI avatars (can use icon placeholders or actual profile images)
- Branding logo in sidebar (simple SVG or text logo)