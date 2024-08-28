import React from 'react';

const ForbiddenPage = () => {
  return (
    <div className="h-screen flex flex-col bg-none items-center justify-center overflow-hidden">
      <h1 className="text-[10vmin] mb-0 text-[#6d712eb8]">Forbidden!</h1>
      <h2 className="text-[5vmin] mt-0 mb-10 text-[#6d712eb8]">Code 403</h2>
    </div>
  );
};

export default ForbiddenPage;
