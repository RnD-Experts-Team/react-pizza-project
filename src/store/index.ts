import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userManagementReducer from './slices/userManagementSlice'; // <--- add this import
import authRulesReducer from './slices/authRulesSlice';
import serviceClientReducer from './slices/serviceClientSlice';
import storeManagementReducer from './slices/storeManagementSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    serviceClient: serviceClientReducer,
    userManagement: userManagementReducer, // <--- add this reducer
    authRules: authRulesReducer, // <--- add this reducer
    storeManagement: storeManagementReducer,
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
