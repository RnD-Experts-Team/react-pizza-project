import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userManagementReducer from './slices/userManagementSlice'; // <--- add this import
import authRulesReducer from './slices/authRulesSlice';
import serviceClientReducer from './slices/serviceClientSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    serviceClient: serviceClientReducer,
    userManagement: userManagementReducer, // <--- add this reducer
    authRules: authRulesReducer, // <--- add this reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});
if (typeof window !== 'undefined') {
  (window as any).__REDUX_STORE__ = store;
}
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
