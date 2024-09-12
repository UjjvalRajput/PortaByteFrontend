"use client";

import React, { useState } from 'react';
import styles from '@/styles/auth.module.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Handle password reset logic here
    console.log('Password reset for:', email);
  };

  return (
    <div className={styles.authpage}>
      <h1>Reset Password</h1>
      <p className={styles.infotext}>Enter your email address and new password to reset your password.</p>
      <form className={styles.form} onSubmit={handleResetPassword}>
        <div className={styles.inputcontainer}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputcontainer}>
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            name="newPassword"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputcontainer}>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.button1}>Change Password</button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
