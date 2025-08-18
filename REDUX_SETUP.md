# Redux Integration with Authentication Service

This document explains the Redux setup that has been integrated with your existing `authService.ts` to provide centralized state management for authentication.

## What Was Added

### 1. Dependencies
```bash
npm install @reduxjs/toolkit react-redux
```

### 2. Store Configuration
- **`src/store/index.ts`** - Main Redux store configuration
- **`src/store/hooks.ts`** - Typed Redux hooks for TypeScript
- **`src/store/slices/authSlice.ts`** - Authentication slice with async thunks

### 3. Custom Hook
- **`src/hooks/useReduxAuth.tsx`** - Custom hook that wraps Redux auth functionality

### 4. Provider Integration
- Updated `src/main.tsx` to wrap the app with Redux Provider

### 5. Example Component
- **`src/examples/LoginWithRedux.tsx`** - Example showing how to migrate from useAuth to Redux

## How It Works

### Redux Store Structure
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  registrationStep: 'register' | 'verify' | 'completed';
  registrationEmail: string | null;
}
```

### Available Actions
The Redux slice provides async thunks for all auth operations:
- `registerUser` - User registration
- `verifyEmailOtp` - Email verification
- `resendVerificationOtp` - Resend verification code
- `loginUser` - User login
- `forgotPassword` - Password reset request
- `resetPassword` - Password reset
- `getUserProfile` - Get user profile
- `logoutUser` - User logout
- `refreshToken` - Token refresh

## Usage Examples

### Basic Usage with useReduxAuth Hook
```typescript
import { useReduxAuth } from '../hooks/useReduxAuth';

const MyComponent = () => {
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    error,
    login,
    logout,
    clearError 
  } = useReduxAuth();

  const handleLogin = async () => {
    const result = await login({ email: 'user@example.com', password: 'password' });
    if (result.type === 'auth/login/fulfilled') {
      console.log('Login successful!');
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};
```

### Direct Redux Usage
```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError } from '../store/slices/authSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector(state => state.auth);

  const handleLogin = async () => {
    const result = await dispatch(loginUser({ 
      email: 'user@example.com', 
      password: 'password' 
    }));
    
    if (result.type === 'auth/login/fulfilled') {
      console.log('Login successful!');
    }
  };

  return (
    // Your component JSX
  );
};
```

## Migration Guide

### From useAuth to useReduxAuth

**Before (using useAuth):**
```typescript
import { useAuth } from '../hooks/useAuth';

const LoginComponent = () => {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async (email: string, password: string) => {
    try {
      setError('');
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed');
    }
  };
};
```

**After (using useReduxAuth):**
```typescript
import { useReduxAuth } from '../hooks/useReduxAuth';

const LoginComponent = () => {
  const { login, isLoading, error, clearError } = useReduxAuth();

  const handleLogin = async (email: string, password: string) => {
    const result = await login({ email, password });
    // Error handling is automatic via Redux slice
    if (result.type === 'auth/login/fulfilled') {
      // Handle success
    }
  };

  // Clear error when user starts typing
  const handleInputChange = () => {
    if (error) clearError();
  };
};
```

### Key Differences

1. **Error Handling**: Redux automatically manages error state
2. **Loading State**: Centralized loading state management
3. **Type Safety**: Full TypeScript support with typed hooks
4. **State Persistence**: Redux state persists across component unmounts
5. **DevTools**: Redux DevTools support for debugging

## Integration with Existing AuthService

The Redux setup **does not replace** your existing `authService.ts`. Instead, it:
- Uses `authService` methods in Redux async thunks
- Maintains the same API endpoints and logic
- Adds centralized state management on top
- Preserves token refresh and interceptor functionality

## Components to Update

To fully migrate to Redux, consider updating these components:

1. **`src/pages/auth/Login.tsx`** - Login form
2. **`src/pages/auth/Register.tsx`** - Registration form
3. **`src/pages/auth/VerifyEmail.tsx`** - Email verification
4. **`src/pages/auth/ForgotPassword.tsx`** - Password reset request
5. **`src/pages/auth/ResetPassword.tsx`** - Password reset form
6. **`src/components/ProtectedRoute.tsx`** - Route protection
7. **`src/components/PublicRoute.tsx`** - Public route handling
8. **`src/components/layouts/MainLayout.tsx`** - Main layout with user info

## Benefits of Redux Integration

1. **Centralized State**: All auth state in one place
2. **Predictable Updates**: Redux patterns for state changes
3. **DevTools Support**: Time-travel debugging
4. **Type Safety**: Full TypeScript integration
5. **Middleware Support**: Easy to add logging, persistence, etc.
6. **Testing**: Easier to test with predictable state changes
7. **Performance**: Optimized re-renders with React-Redux

## Next Steps

1. **Test the Setup**: Run the application to ensure Redux is working
2. **Migrate Components**: Update auth components one by one
3. **Add Persistence**: Consider adding Redux Persist for state persistence
4. **Add Middleware**: Add logging or other middleware as needed
5. **Remove Old Hook**: Once migration is complete, remove the old `useAuth` hook

## Troubleshooting

### Common Issues

1. **"Cannot read property of undefined"**: Ensure Redux Provider is properly wrapped around your app
2. **TypeScript errors**: Make sure you're using the typed hooks from `src/store/hooks.ts`
3. **State not updating**: Check that you're dispatching actions correctly
4. **Token not persisting**: The token is still managed by `authService.ts` and localStorage

### Debug Tips

1. Install Redux DevTools Extension for browser debugging
2. Check Redux state in DevTools
3. Monitor network requests to ensure authService is working
4. Use console.log in async thunks to debug API calls

The Redux setup is now ready to use alongside your existing authentication service!