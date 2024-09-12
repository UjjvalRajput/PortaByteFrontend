import { configureStore } from "@reduxjs/toolkit"; // Import the configureStore function from @reduxjs/toolkit to create the Redux store with the reducers and middleware defined in the slices and the store file
import { authSlice } from "./auth-slice"; // Import the auth slice reducer
import { TypedUseSelectorHook, useSelector } from "react-redux"; // Import the useSelector hook from react-redux to access the state in components

export const store = configureStore({ // Create the Redux store with the auth slice reducer
  reducer: {
    auth: authSlice.reducer
  },
});

export type RootState = ReturnType<typeof store.getState>; // Define the RootState type to access the state in components
export type AppDispatch = typeof store.dispatch; // Define the AppDispatch type to dispatch actions in components
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // Define the useAppSelector hook to access the state in components
