"use client";
import React, { useCallback, useEffect } from "react";
import styles from '@/styles/navbar.module.css';
import { usePathname, useRouter } from 'next/navigation';
import { AppDispatch, useAppSelector } from '@/redux/features/store';
import { useDispatch } from 'react-redux';
import { login, logout } from '@/redux/features/auth-slice';
import { toast } from 'react-toastify';

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  const fetchData = async (url: string, options: RequestInit) => {
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      if (res.ok && data.success) {
        return data;
      } else {
        throw new Error(data.message || 'An error occurred');
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const checkLogin = useCallback(async () => {
    try {
      const data = await fetchData(process.env.NEXT_PUBLIC_API_URL + '/auth/check-login', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (data.success) {
        await getUserData();
      } else {
        dispatch(logout());
      }
    } catch {
      dispatch(logout());
    }
  }, [dispatch]);

  const getUserData = useCallback(async () => {
    try {
      const data = await fetchData(process.env.NEXT_PUBLIC_API_URL + '/auth/get-user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      dispatch(login(data.data));
      router.push('/myfiles');
    } catch {
      dispatch(logout());
    }
  }, [dispatch, router]);

  const handleLogout = async () => {
    try {
      await fetchData(process.env.NEXT_PUBLIC_API_URL + '/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      dispatch(logout());
      router.push('/login');
    } catch {
      toast.error('Logout failed. Please try again.');
    }
  };

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  return (
    <div className={styles.navbar}>
      <h1>PortaByte</h1>
      <div className={styles.right}>
        {auth.isAuthenticated ? (
          <>
            <p
              onClick={() => router.push('/myfiles')}
              className={pathname === '/myfiles' ? styles.active : ''}
            >
              My files
            </p>
            <p
              onClick={() => router.push('/share')}
              className={pathname === '/share' ? styles.active : ''}
            >
              Share
            </p>
            <p onClick={handleLogout}>
              Log out
            </p>
          </>
        ) : (
          <>
            <p
              onClick={() => router.push('/signup')}
              className={pathname === '/signup' ? styles.active : ''}
            >
              Sign up
            </p>
            <p
              onClick={() => router.push('/login')}
              className={pathname === '/login' ? styles.active : ''}
            >
              Login
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
