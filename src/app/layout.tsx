import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ReduxProvider from "@/redux/features/provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children, 
}: Readonly<{ // Define the children prop as a React node and make it readonly to prevent modifications to the prop value
  children: React.ReactNode; // Define the children prop as a React node
}>) {
  return (
    <html lang="en"> {/* Set the language of the document to English */}
      <body className={inter.className}> {/* Add the inter font class to the body tag */}
        <ReduxProvider> {/* Wrap the application with the ReduxProvider component */}
          <Navbar/> {/* Render the Navbar component */}
          {children} {/* Render the children components */}
          <ToastContainer /> {/* Render the ToastContainer component to display toast notifications */}
        </ReduxProvider> 
      </body>
    </html>
  );
}
