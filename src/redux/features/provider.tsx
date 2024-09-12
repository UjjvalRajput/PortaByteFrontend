"use client";

import { store } from '@/redux/features/store'; // Import the Redux store from the store file
import React from 'react';
import { Provider } from 'react-redux'; // Import the Provider component from react-redux to provide the Redux store to the application

export default function ReduxProvider({children} : {children: React.ReactNode}) { // Create a ReduxProvider component to wrap the application with the Redux Provider
  return <Provider store={store}>{children}</Provider>; // Provide the Redux store to the application
}

