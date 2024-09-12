"use client";

import React, { useCallback, useState } from "react";
import styles from '@/styles/auth.module.css';
import { useDropzone } from "react-dropzone";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const SharePage = () => {
  const [file, setFile] = useState<File | null>(null); // Single file to share
  const [email, setEmail] = useState(''); // Email address to share the file with
  const [fileName, setFileName] = useState<string>(''); // Name of the file

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]); // Only take the first file
      setFileName(acceptedFiles[0].name); // Set the file name
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false, // Only allow single file
    onDragEnter: () => {},
    onDragOver: () => {},
    onDragLeave: () => {},
  });

  const handleRemoveFile = () => {
    setFile(null); // Remove the file
    setFileName(''); // Clear the file name
  };

  const [uploading, setUploading] = useState(false);

  const router = useRouter();

  const validateAndGeneratePostObjectUrl = async () => {
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/file/validate-email', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receiverEmail: email,
      }),
    });
  
    let data = await res.json();
    if (!data.success) {
      toast.error(data.message); // Display error message if validation fails
      return null;
    }
  
    // If validation is successful, generate the post object URL
    return await generatePostObjectUrl();
  };

  const generatePostObjectUrl = async () => {
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/file/generate-post-object-url', {
      method: 'GET',
      credentials: 'include'
    });
    let data = await res.json();
    if (data.success) {
      return data.data;
    } else {
      console.error('Failed to generate post object URL:', data.message);
      toast.error(data.message);
      return null;
    }
  };

  const uploadToS3ByUrl = async (url: any) => {
    setUploading(true);
    const options = {
      method: 'PUT',
      body: file
    };
    
    let res = await fetch(url, options); // Upload the file to S3 bucket using the URL provided by the server
    if (res.ok) {
      setUploading(false);
      console.log('File uploaded to S3 successfully');
      return true;
    } else {
      setUploading(false);
      console.error('Failed to upload file to S3:', res.statusText);
      return false;
  }
  };

  const handleUpload = async () => {
    if (!email && !file) {
      toast.error('Please mention the receiver\'s email and choose a file to share');
      return;
    }
    if (!email) {
      toast.error('Please mention the receiver\'s email');
      return;
    }
    if (!file) {
      toast.error('Please choose a file to share');
      return;
    }
    let postObjectUrl = await validateAndGeneratePostObjectUrl();
    if (!postObjectUrl) {
      setUploading(false);
      return;
    }
  
    let fileKey = postObjectUrl.fileKey;
    let fileUrl = postObjectUrl.signedUrl;
    let uploaded = await uploadToS3ByUrl(fileUrl);
    if (!uploaded) {
      setUploading(false);
      toast.error('Failed to upload file');
      return;
    }
  
    toast.success('File uploaded successfully');
  
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/file/share-file', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receiverEmail: email,
        fileKey: fileKey,
        fileName: fileName,
        fileType: file?.type || '',
      }),
    });
  
    let data = await res.json();
    setUploading(false);
  
    if (data.success) {
      toast.success('File shared successfully');
      router.push('/myfiles');
    } else {
      toast.error('Failed to share file');
    }
  };

  return (
    <div className={styles.authpage}>
      <div className={styles.inputcontainer}>
        <label htmlFor="email">Receiver&apos;s Email</label>
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
        <div className={styles.dropzone} {...getRootProps()}>
          <input {...getInputProps() as React.InputHTMLAttributes<HTMLInputElement>} />
          {
            isDragActive ?
              <p>Drop the file here ...</p> :
              <div className={styles.droptext}>
                <p>Drag and drop your file here, or click to choose a file from your device.</p>
              </div>
          }
        </div>
        {file && (
          <div className={styles.filecard}>
            <div className={styles.left}>
              <p>{file.name}</p>
              <p>{(file.size / 1024).toFixed(2)} KB</p>
            </div>
            <div className={styles.right}>
              <button onClick={handleRemoveFile}>Remove</button>
              <button onClick={() => window.open(URL.createObjectURL(file))}>View</button>
            </div>
          </div>
        )}
      </div>
      <button className={styles.button1} onClick={handleUpload}>Share</button>
    </div>
  );
};

export default SharePage;
