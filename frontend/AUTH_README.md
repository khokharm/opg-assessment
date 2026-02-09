# Authentication Pages

This directory contains the authentication pages for the Weather Dashboard application, built with Next.js 14+ and shadcn/ui components.

## Pages Created

### 1. Login Page (`/login`)
- **Location**: `frontend/app/login/page.tsx`
- **Features**:
  - Email and password input fields
  - Form validation
  - Error handling with user-friendly messages
  - Loading state during authentication
  - Link to registration page
  - Responsive design with shadcn Card component

### 2. Register Page (`/register`)
- **Location**: `frontend/app/register/page.tsx`
- **Features**:
  - Username, email, and password fields
  - Password confirmation
  - Client-side validation
  - Form validation matching backend requirements
  - Error handling
  - Loading state
  - Link to login page

### 3. Logout Page (`/logout`)
- **Location**: `frontend/app/logout/page.tsx`
- **Features**:
  - Confirmation before logging out
  - Loading state during logout
  - Automatic redirect to login after logout
  - Cancel option to go back

## Components Created

### AuthContext (`contexts/AuthContext.tsx`)
- Provides global authentication state
- Manages user session
- Exposes `login`, `register`, `logout` methods
- Automatically checks authentication on app load

### Header Component (`components/Header.tsx`)
- Displays user authentication status
- Shows username when logged in
- Sign In/Sign Up buttons when logged out
- Sign Out button when logged in

### API Utility (`lib/api.ts`)
- Contains all API functions for authentication
- Handles fetch requests to backend
- Includes proper error handling
- Uses credentials for cookie-based authentication

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 2. Install Dependencies

The required shadcn components are already installed:
- Button
- Label
- Input
- Card

### 3. Backend Configuration

Ensure your backend is running and CORS is properly configured to accept requests from your frontend:

```typescript
// backend/src/app.ts should include:
app.use(cors({
  origin: 'http://localhost:3001', // Your Next.js dev server
  credentials: true
}));
```

### 4. Run the Development Server

```bash
cd frontend
npm run dev
```

Visit:
- Login: http://localhost:3001/login
- Register: http://localhost:3001/register
- Logout: http://localhost:3001/logout

## Usage

### Using Authentication in Components

```tsx
import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, loading, login, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Please login</div>;

  return <div>Welcome, {user.username}!</div>;
}
```

### Protected Routes

To protect a route, check authentication in the component:

```tsx
"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected content</div>;
}
```

## API Endpoints

The frontend communicates with these backend endpoints:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

## Design Features

- **Modern UI**: Using shadcn/ui components with Tailwind CSS
- **Responsive**: Works on mobile, tablet, and desktop
- **Accessible**: Proper labels, ARIA attributes, and keyboard navigation
- **User-friendly**: Clear error messages and loading states
- **Consistent**: Follows the same design language as the rest of the app

## Security Features

- HTTP-only cookies for token storage
- CORS configured for security
- Password requirements enforced
- Client and server-side validation
- Secure cookie settings in production

## Next Steps

Consider adding:
- Password reset functionality
- Email verification
- OAuth providers (Google, GitHub, etc.)
- Remember me functionality
- Two-factor authentication
- User profile page
- Password strength indicator
