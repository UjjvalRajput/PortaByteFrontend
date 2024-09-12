"use client"
import React, { useState } from 'react'
import styles from '@/styles/auth.module.css'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Link from 'next/link'


interface FormData {
  name: string,
  email: string,
  password: string,
}

const SignupPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  } as FormData);
  const [code, setCode] = React.useState('');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [sendingCode, setSendingCode] = React.useState<boolean>(false);
  const sendCode = async () => {
    setSendingCode(true);
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/verification-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email: formData.email }),
    })

    let data = await res.json();
    setSendingCode(false);
    if (data.success) {
      toast.success('Verification code sent');
    } else {
      toast.error(data.message);
    }
  };
  const handleSignup = async () => {
    if (formData.name === '' || formData.email === '' || formData.password === '' || code === '') {
      toast.error('Please fill in all fields');
      return;
    }

    let formData2 = new FormData();
    formData2.append('name', formData.name);
    formData2.append('email', formData.email);
    formData2.append('password', formData.password);
    formData2.append('code', code);

    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/register', {
      method: 'POST',
      credentials: 'include',
      body: formData2,
    });

    let data = await res.json();
    if (data.success) {
      toast.success('Account created');
      router.push('/login');
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className={styles.authpage}>
      <h1>Join For Free</h1>
      <div className={styles.inputcontainer}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} />
      </div>

      <div className={styles.inputcontainer}>
        <label htmlFor="email">Email</label>
        <div className={styles.inputrow}>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} />
          <div>
            {
              !sendingCode ?
              <button onClick={sendCode} className={styles.verifybutton}>Send code</button> :
              <button className={styles.verifybutton} disabled style={
                { backgroundColor: 'gray',
                  cursor: 'not-allowed'
                } 
              }>Sending...</button>
            }
          </div>
        </div>
      </div>

      <div className={styles.inputcontainer}>
        <label htmlFor="code">Verification code</label>
        <input type="text" name="code" id="code" value={code} onChange={(e) => setCode(e.target.value)} />
      </div>

      <div className={styles.inputcontainer}>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" value={formData.password} onChange={handleInputChange} />
      </div>

      <button 
      className={styles.button1}
      type='button'
      onClick={handleSignup}
      >Sign up</button>

      <Link href='/login'>
        Already have an account? Log in
      </Link>
    </div>
  );
};

export default SignupPage;