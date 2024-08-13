import React from 'react';

const ForbiddenPage = () => {
  return (
    <div className="h-screen flex flex-col bg-none items-center justify-center overflow-hidden">
      <h1 className="text-[10vmin] mb-0">Forbidden!</h1>
      <h2 className="text-[5vmin] mt-0 mb-10">Code 403</h2>
    </div>
  );
};

export default ForbiddenPage;
