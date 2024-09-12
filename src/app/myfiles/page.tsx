"use client";

import React from "react";
import styles from '@/styles/myfiles.module.css';
import { toast } from "react-toastify";

interface File {
  createdAt: string;
  fileName: string;
  fileUrl: string;
  fileType: string | null;
  receiverEmail: string;
  senderEmail: string;
  sharedAt: string;
  updatedAt: string;
  _id: string;
}

const MyFilesPage = () => {
  const [allFiles, setAllFiles] = React.useState<File[]>([]);
  const [sortOption, setSortOption] = React.useState<'date' | 'name' | 'type' | 'sender' | 'receiver'>('date');

  const getAllFiles = async () => {
    try {
      let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/file/all-files', {
        method: 'GET',
        credentials: 'include',
      });
      if (res.ok) {
        let data = await res.json();
        if (data.success) {
          setAllFiles(data.data);
        } else {
          console.error("Failed to fetch files:", data.message);
        }
      } else {
        console.error("Failed to fetch files:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching all files:", error);
    }
  }

  React.useEffect(() => {
    getAllFiles();
  }, []);

  // Function to extract file type based on fileName or fallback to fileType
  const getFileType = (fileName: string) => {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
      return 'file';
    }
    const ext = fileName.substring(lastDotIndex + 1).toLowerCase(); // Extracts the extension and converts to lowercase
    switch (ext) {
      case 'pdf': return 'pdf';
      case 'docx': return 'docx';
      case 'jpg':
      case 'jpeg':
      case 'png': return 'img';
      case 'mp4':
      case 'mkv':
      case 'avi': return ext;
      case 'mp3':
      case 'wav':
      case 'flac': return ext;
      case 'zip':
      case 'rar':
      case '7z': return 'zip';
      case 'txt': return 'txt';
      case 'pptx':
      case 'ppt': return 'ppt';
      case 'xlsx':
      case 'xls': return 'xls';
      case 'csv': return 'csv';
      default: return 'file';
    }
  };

  // Fallback logic for determining the file type
  const getFileTypeWithFallback = (file: File) => {
    let type = getFileType(file.fileName);
    // If the file type by name yields "file", try using the fileType field
    if (type === 'file' && file.fileType) {
      type = file.fileType;
    }
    return type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ' ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value as 'date' | 'name' | 'type' | 'sender' | 'receiver');
  };

  // Sorting files based on the selected option
  const sortedFiles = [...allFiles].sort((a, b) => {
    switch (sortOption) {
      case 'date':
        return new Date(b.sharedAt).getTime() - new Date(a.sharedAt).getTime();
      case 'name':
        return a.fileName.localeCompare(b.fileName);
      case 'type':
        return getFileTypeWithFallback(a).localeCompare(getFileTypeWithFallback(b));
      case 'sender':
        return a.senderEmail.localeCompare(b.senderEmail);
      case 'receiver':
        return a.receiverEmail.localeCompare(b.receiverEmail);
      default:
        return 0;
    }
  });

  // Function to retrieve the file's URL from S3
  const getURL = async (fileKey: string) => {
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/file/get-s3-url?key=' + fileKey, {
      method: 'GET',
      credentials: 'include',
    });
  
    let data = await res.json();
    if (data.success) {
      return data.data;
    } else {
      console.error('Failed to get S3 URL:', data.message);
      return null;
    }
  };

  return (
    <div className={styles.allfiles}>
      <div className={styles.sortControls}>
        <label htmlFor="sortOptions">Sort by: </label>
        <select id="sortOptions" value={sortOption} onChange={handleSortChange}>
          <option value="date">Most Recent</option>
          <option value="name">File Name</option>
          <option value="type">File Type</option>
          <option value="sender">Sender</option>
          <option value="receiver">Receiver</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>File Name</th>
            <th>File Type</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Shared At</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {sortedFiles.map((file, index) => (
            <tr key={index}>
              <td>{file.fileName}</td>
              <td>{getFileTypeWithFallback(file)}</td>
              <td>{file.senderEmail}</td>
              <td>{file.receiverEmail}</td>
              <td>{formatDate(file.sharedAt)}</td>
              <td>
                <a
                  href="#"
                  onClick={async (e) => {
                    e.preventDefault();
                    let s3Url: string | null = await getURL(file.fileUrl);
                    if (!s3Url) {
                      toast.error('Failed to get file URL');
                      return;
                    }
                    window.open(s3Url, '_blank');
                  }}
                  className={styles.viewLink}
                >
                  Open
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyFilesPage;
