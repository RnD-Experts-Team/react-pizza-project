import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import permissionsReducer from '../features/permissions/store/permissionsSlice';
import rolesReducer from '../features/roles/store/rolesSlice'; // Add this import
import usersReducer from '../features/users/store/usersSlice'; // Add this import
import authRulesReducer from '../features/authorizationRules/store/authRulesSlice'; // Add this import
import serviceClientsReducer from '../features/serviceClients/store/serviceClientsSlice'; // Add this import
import storesReducer from '../features/stores/store/storesSlice'; // Add this import
import userRolesStoresAssignmentReducer from '../features/userRolesStoresAssignment/store/userRolesStoresAssignmentSlice'; // Add this import
import roleHierarchyReducer from '../features/storeHierarchy/store/roleHierarchySlice'; // Add this import
import positionsReducer from '../features/positions/store/positionsSlice'; // Add this import
import statusesReducer from '../features/statuses/store/statusesSlice';
import skillsReducer from '../features/skills/store/skillSlice';
import preferencesReducer from '../features/preference/store/preferencesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    permissions: permissionsReducer,
    roles: rolesReducer, // Add this line
    users: usersReducer, // Add this line
    authRules: authRulesReducer, // Add this line
    serviceClients: serviceClientsReducer, // Add this line
    positions: positionsReducer, // Add this line
    stores: storesReducer, // Add this line
    userRolesStoresAssignment: userRolesStoresAssignmentReducer, // Add this line
    roleHierarchy: roleHierarchyReducer, // Add this line
    statuses: statusesReducer,
    skills: skillsReducer,
    preferences: preferencesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
