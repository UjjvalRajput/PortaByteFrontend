import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface AuthState { // Define the initial state of the slice
    isAuthenticated: boolean; // A boolean value to check if the user is authenticated
    user: null | any; // A user object that will be null if the user is not authenticated
}

const initialState: AuthState = { // Define the initial state of the slice
    isAuthenticated : false, // The user is not authenticated by default
    user: null, // The user object is null by default
};

export const authSlice = createSlice({ // Create a slice for the authentication state
    name: 'auth', // Name of the slice
    initialState, // Initial state of the slice
    reducers: { // Define the reducers for the slice to update the state
        login: (state, action: PayloadAction<any>) => { // A reducer to update the state when the user logs in
            state.isAuthenticated = true; // Set isAuthenticated to true
            state.user = action.payload; // Set the user object to the payload
        }, 
        logout: (state) => { // A reducer to update the state when the user logs out
            state.isAuthenticated = false; // Set isAuthenticated to false
            state.user = null; // Set the user object to null
        },
    },
});

export const { login, logout } = authSlice.actions; // Export the actions to dispatch
export default authSlice.reducer; // Export the reducer to be used in the store