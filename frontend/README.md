# Frontend - Weather Tracker

Next.js 16 React application with TypeScript, Tailwind CSS, and modern UI components.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Development](#development)
6. [Components](#components)
7. [API Integration](#api-integration)
8. [Styling](#styling)
9. [Authentication](#authentication)
10. [Environment Variables](#environment-variables)
11. [Building & Deployment](#building--deployment)
12. [Storybook](#storybook)
13. [Testing](#testing)
14. [Troubleshooting](#troubleshooting)

---

## Overview

The frontend is a modern, responsive web application built with Next.js 16 that provides:

- **Weather Search** - Search for US cities and view current weather
- **Dashboard** - Personalized dashboard with tracked cities
- **7-Day Forecast** - Detailed weather predictions
- **User Authentication** - Secure login/registration
- **Responsive Design** - Works on all device sizes
- **Component Library** - Documented in Storybook

**Live Ports:**
- Development: http://localhost:3000
- Storybook: http://localhost:6006

---

## Tech Stack

### Core Framework
- **Next.js 16.1.6** - React framework with App Router
- **React 19.2.3** - Latest React with concurrent features
- **TypeScript 5** - Type safety and better DX

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **Radix UI** - Headless UI primitives
- **Lucide React** - Beautiful icon library
- **class-variance-authority** - Component variants
- **tailwind-merge** - Merge Tailwind classes

### Development Tools
- **Storybook 10.2** - Component development environment
- **Vitest 4** - Unit testing framework
- **Playwright** - Browser automation for testing
- **ESLint 9** - Code linting
- **PostCSS** - CSS processing

---

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (providers, fonts)
│   ├── page.tsx                 # Home page (weather search)
│   ├── globals.css              # Global styles
│   ├── dashboard/
│   │   └── page.tsx            # User dashboard (tracked cities)
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── register/
│   │   └── page.tsx            # Registration page
│   └── logout/
│       └── page.tsx            # Logout page
│
├── components/                   # React components
│   ├── Navbar.tsx               # Main navigation with auth
│   ├── Header.tsx               # Page header component
│   ├── SearchBar.tsx            # City search with autocomplete
│   ├── WeatherDisplayCard.tsx   # Weather data card
│   ├── WeatherCardList.tsx      # Grid of weather cards
│   ├── ProtectedRoute.tsx       # Auth guard component
│   └── ui/                      # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── navigation-menu.tsx
│       └── ... (more UI primitives)
│
├── contexts/                     # React Context providers
│   └── AuthContext.tsx          # Authentication state management
│
├── lib/                         # Utility functions
│   ├── api.ts                   # API client (fetch wrapper)
│   └── utils.ts                 # Helper functions (cn, etc.)
│
├── stories/                     # Storybook stories
│   ├── SearchBar.stories.ts
│   ├── WeatherDisplayCard.stories.ts
│   ├── WeatherCardList.stories.ts
│   └── ... (component demos)
│
├── .storybook/                  # Storybook configuration
│   ├── main.ts
│   ├── preview.ts
│   └── vitest.setup.ts
│
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind CSS config
├── next.config.ts               # Next.js config
├── vitest.config.ts             # Vitest test config
└── components.json              # shadcn/ui config
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on http://localhost:4000

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Open:** http://localhost:3000

---

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start Next.js dev server (port 3000)
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint

# Storybook
npm run storybook        # Start Storybook dev server (port 6006)
npm run build-storybook  # Build static Storybook

# Testing (when configured)
npm run test             # Run tests
npm run test:ui          # Run tests with UI
```

### Development Workflow

1. **Start backend API** (required)
   ```bash
   cd ../backend && npm run dev
   ```

2. **Start frontend**
   ```bash
   npm run dev
   ```

3. **Make changes** - Hot reload enabled
4. **View in Storybook** (optional)
   ```bash
   npm run storybook
   ```

---

## Components

### Core Components

#### Navbar
Navigation bar with authentication state.

**Features:**
- Logo and app name
- Login/Register buttons (when logged out)
- User dropdown menu (when logged in)
- Responsive mobile menu

**Location:** `components/Navbar.tsx`

---

#### SearchBar
City search with autocomplete suggestions.

**Features:**
- Real-time search as you type
- Debounced API calls (300ms)
- Keyboard navigation (↑/↓ arrows, Enter)
- Click outside to close
- Loading states

**Props:**
```typescript
interface SearchBarProps {
  onLocationSelect: (location: Location) => void;
  className?: string;
}
```

**Location:** `components/SearchBar.tsx`

---

#### WeatherDisplayCard
Display weather data for a single location.

**Features:**
- Current temperature and conditions
- Weather icon
- Humidity, wind, pressure details
- 7-day forecast toggle
- Add/remove from tracked cities
- Loading and error states

**Props:**
```typescript
interface WeatherDisplayCardProps {
  weatherData: WeatherData;
  onRemoveCity?: (cityId: string) => void;
  showAddButton?: boolean;
  showRemoveButton?: boolean;
}
```

**Location:** `components/WeatherDisplayCard.tsx`

---

#### WeatherCardList
Grid layout for multiple weather cards.

**Features:**
- Responsive grid (1-3 columns)
- Loading skeletons
- Empty state message

**Props:**
```typescript
interface WeatherCardListProps {
  weatherDataArray: WeatherData[];
  isLoading?: boolean;
  onRemoveCity?: (cityId: string) => void;
}
```

**Location:** `components/WeatherCardList.tsx`

---

### UI Components (shadcn/ui)

Pre-built, accessible components from shadcn/ui:

- **Button** - Various styles and sizes
- **Card** - Content container with header/footer
- **Input** - Form input field
- **Label** - Form label
- **Dialog** - Modal dialogs
- **Dropdown Menu** - Context menus
- **Navigation Menu** - Navigation components
- **Sheet** - Slide-in panels
- **Avatar** - User avatars
- **Command** - Command palette

**Documentation:** See Storybook or https://ui.shadcn.com/

---

## API Integration

### API Client

**Location:** `lib/api.ts`

All API calls go through centralized client with:
- Automatic credentials (cookies)
- Error handling
- TypeScript types

### Available Functions

```typescript
// Authentication
await register(email, password, username)
await login(email, password)
await logout()
await getCurrentUser()

// Location Search
await searchLocations(query)

// Tracked Cities
await addTrackedCity(city)
await getTrackedCities()
await removeTrackedCity(cityId)
await getTrackedCitiesWeather()
```

### Usage Example

```typescript
import { login, getTrackedCitiesWeather } from '@/lib/api';

// Login user
try {
  const response = await login('user@example.com', 'password');
  console.log('Logged in:', response.user);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Get weather data
try {
  const data = await getTrackedCitiesWeather();
  console.log('Weather:', data.weatherData);
} catch (error) {
  console.error('Failed:', error.message);
}
```

### Environment Configuration

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
```

**Set in `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## Styling

### Tailwind CSS

Using Tailwind CSS 4 with utility classes.

**Configuration:** `tailwind.config.ts`

**Custom Theme:**
```javascript
theme: {
  extend: {
    colors: {
      // Custom color palette
    },
    borderRadius: {
      // Custom border radius
    },
  },
}
```

### Global Styles

**Location:** `app/globals.css`

Includes:
- Tailwind directives
- CSS variables for theming
- Global resets
- Custom animations

### Component Styling

**Utility Function:**
```typescript
import { cn } from '@/lib/utils';

// Merge Tailwind classes
<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
)} />
```

### Dark Mode (Planned)

```typescript
// Enable in tailwind.config.ts
darkMode: 'class', // or 'media'
```

---

## Authentication

### Auth Context

**Location:** `contexts/AuthContext.tsx`

Provides authentication state to entire app.

**Features:**
- User state management
- Login/logout functions
- Auto-restore session on page load
- Loading states

**Usage:**
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, loading, login, logout } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;
  
  return <div>Welcome, {user.username}!</div>;
}
```

### Protected Routes

**Component:** `components/ProtectedRoute.tsx`

Wraps pages that require authentication.

```typescript
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      {/* Your protected content */}
    </ProtectedRoute>
  );
}
```

### Auth Flow

1. **Registration:**
   - User fills form at `/register`
   - API creates account
   - JWT token set in httpOnly cookie
   - Redirect to dashboard

2. **Login:**
   - User fills form at `/login`
   - API validates credentials
   - JWT token set in httpOnly cookie
   - Redirect to dashboard

3. **Session Restore:**
   - On app load, check for existing token
   - Call `/api/auth/me` to get user
   - Restore user state in context

4. **Logout:**
   - Call `/api/auth/logout`
   - Clear cookie
   - Redirect to home

**Related Docs:** [AUTH_README.md](AUTH_README.md)

---

## Environment Variables

### Required Variables

Create `.env.local` file:

```env
# API Backend URL
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Optional Variables

```env
# Next.js Configuration
NEXT_PUBLIC_APP_NAME=Weather Tracker
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Feature Flags
NEXT_PUBLIC_ENABLE_DARK_MODE=false
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=false
```

**Note:** All variables must start with `NEXT_PUBLIC_` to be accessible in browser.

---

## Building & Deployment

### Development Build

```bash
npm run dev
```

### Production Build

```bash
# Build optimized bundle
npm run build

# Test production build locally
npm start

# Open http://localhost:3000
```

### Docker Deployment

```bash
# Build Docker image
docker build -t weather-tracker-frontend .

# Run container
docker run -p 3000:3000 weather-tracker-frontend
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Environment Variables:** Set in Vercel dashboard.

---

## Storybook

Component development environment for building UI in isolation.

### Start Storybook

```bash
npm run storybook
```

**Open:** http://localhost:6006

### Available Stories

- **SearchBar** - City search component
- **WeatherDisplayCard** - Weather card variations
- **WeatherCardList** - Multiple weather cards
- **Button** - Button component variants
- **Header** - Page header component

### Create New Story

```typescript
// components/MyComponent.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import MyComponent from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: {
    // Component props
  },
};
```

### Build Storybook

```bash
npm run build-storybook
# Output: storybook-static/
```

---

## Testing

### Testing Infrastructure

- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **@vitest/browser** - Browser-based component tests

### Run Tests (When Configured)

```bash
npm run test           # Run all tests
npm run test:ui        # Run with UI
npm run test:coverage  # Generate coverage
```

### Example Test

```typescript
// components/SearchBar.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders search input', () => {
    render(<SearchBar onLocationSelect={() => {}} />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });
});
```

---

## Troubleshooting

### Common Issues

#### Port 3000 Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

#### API Connection Failed

```bash
# Check backend is running
curl http://localhost:4000/health

# Check environment variable
echo $NEXT_PUBLIC_API_URL
```

#### Module Not Found

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Storybook Won't Start

```bash
# Clear Storybook cache
rm -rf node_modules/.cache

# Rebuild
npm run build-storybook
```

#### CORS Errors

- Ensure backend allows your frontend origin
- Check `credentials: 'include'` in API calls
- Verify CORS config in backend

#### TypeScript Errors

```bash
# Check TypeScript
npx tsc --noEmit

# Restart TypeScript server in editor
# VS Code: Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

---

## Performance Optimization

### Image Optimization

Use Next.js Image component:

```tsx
import Image from 'next/image';

<Image
  src="/weather-icon.png"
  alt="Weather"
  width={64}
  height={64}
  priority
/>
```

### Code Splitting

Automatic with Next.js App Router:
- Each route is a separate chunk
- Dynamic imports for heavy components

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

### Caching

- API responses cached with React Query (if added)
- Static assets cached by Next.js
- Service Worker for offline support (planned)

---

## Best Practices

### Component Guidelines

1. **Keep components small** - Single responsibility
2. **Extract reusable logic** - Custom hooks
3. **Use TypeScript** - Type all props and state
4. **Document with Storybook** - Show all variants
5. **Handle loading/error states** - Better UX

### File Organization

```
components/
├── ComponentName/          # Component folder
│   ├── index.tsx          # Main component
│   ├── ComponentName.stories.ts
│   ├── ComponentName.test.ts
│   └── types.ts           # Component-specific types
```

### Naming Conventions

- **Components:** PascalCase (`MyComponent.tsx`)
- **Utilities:** camelCase (`myHelper.ts`)
- **Constants:** UPPER_SNAKE_CASE
- **Types/Interfaces:** PascalCase (`UserProfile`)

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Storybook](https://storybook.js.org/docs)

### Related Files
- [Root README](../README.md) - Project overview
- [Backend README](../backend/README.md) - API documentation
- [API Documentation](../API_DOCUMENTATION.md) - API reference
- [Setup Guide](../SETUP_GUIDE.md) - Installation guide

---

**Last Updated:** February 2026
**Next.js Version:** 16.1.6
**React Version:** 19.2.3
