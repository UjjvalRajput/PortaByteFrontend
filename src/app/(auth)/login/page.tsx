"use client";
import styles from '@/styles/auth.module.css';
import Link from 'next/link';
import React from 'react';
import { AppDispatch, useAppSelector } from '@/redux/features/store';
import { useDispatch } from 'react-redux';
import { login, logout } from '@/redux/features/auth-slice';
import { useRouter } from 'next/navigation';
import {toast } from 'react-toastify';

interface FormData { // Define the FormData interface to represent the form data
  email: string; // A string value for the email
  password: string; // A string value for the password
}

const LoginPage = () => {
  const router = useRouter(); // Get the router object to navigate to different pages
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated); // Get the isAuthenticated state from the Redux store
  const dispatch = useDispatch<AppDispatch>(); // Get the dispatch function to dispatch actions to the Redux store 
  const [formData, setFormData] = React.useState<FormData>({ // Define the formData state to store the form data
    email: '', // Initialize the email value as an empty string
    password: '', // Initialize the password value as an empty string
  }); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Define a function to handle input changes
    const { name, value } = e.target; // Get the name and value of the input field
    setFormData({ ...formData, [name]: value }); // Update the form data with the new value
  }

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields");
        return;
    }

    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: formData.email, 
            password: formData.password
        }),
        credentials: 'include',
    });

    let data = await res.json();
    if (res.ok) {
        toast.success("Login successful");
        getUserData();
    } else {
        toast.error(data.message);
    }
  };

  const getUserData = async () => {
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/get-user', {
      method: 'GET', // Send a GET request to the endpoint
      credentials: 'include', // Always send credentials (cookies, HTTP authentication) with the request, regardless of the origin of the request
    });

    let data = await res.json(); // Parse the response data as JSON
    if (res.ok) { // If the response is successful
      dispatch(login(data.data)); // Dispatch the login action with the user data
      router.push('/myfiles'); // Redirect the user to the dashboard page
    } else {
      dispatch(logout()); // Dispatch the logout action
      toast.error(data.message); // Display an error message
    }
  };

  return (
    <div className={styles.authpage}>
      <h1>Welcome Back</h1>
      <div className={styles.inputcontainer}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" autoComplete="email" value={formData.email} onChange={handleInputChange} /> 
      </div>

      <div className={styles.inputcontainer}>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" value={formData.password} onChange={handleInputChange} />
      </div>

      <button 
      className={styles.button1}
      type='button'
      onClick={handleLogin}
      >Login</button>
      
      <Link href='/forgotpassword'>
        Forgot password?
      </Link>

      <Link href='/signup'>
        Don&apos;t have an account? Sign up
      </Link>
    </div>
  );
};

export default LoginPage;