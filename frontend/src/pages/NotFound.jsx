// src/components/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegWindowMaximize } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className=" fixed left-0  top-0 w-full flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col items-center">
        <FaRegWindowMaximize className="text-gray-700 text-9xl mb-4" />
        <div className="text-9xl mb-4">{`{404}`}</div>
        <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
        <p className="text-xl mb-4">Sorry, but we can't find the page you are looking for...</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
