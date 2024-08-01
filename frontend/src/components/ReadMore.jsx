import React, { useState, useEffect, useRef } from 'react';

const ReadMore = ({ children, maxLines = 10 }) => {
  const [isTruncated, setIsTruncated] = useState(true);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      const lineHeight = parseFloat(window.getComputedStyle(contentRef.current).lineHeight);
      const contentHeight = contentRef.current.scrollHeight;
      const maxHeight = lineHeight * maxLines;

      setIsOverflowing(contentHeight > maxHeight);
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, [maxLines]);

  const toggleIsTruncated = () => {
    setIsTruncated(!isTruncated);
  };

  return (
    <div>
      <div
        ref={contentRef}
        className={`overflow-clip whitespace-pre-wrap break-words  ${isTruncated ? ` line-clamp-${maxLines}` : ''}`}
        style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: isTruncated ? maxLines : '', lineHeight: '1.3em',  wordBreak: 'break-word' }}
      >
        {children}
      </div>
      {isOverflowing && (
        <button onClick={toggleIsTruncated} className="text-blue-500 mt-2">
          {isTruncated ? 'Read More' : 'Show Less'}
        </button>
      )}
    </div>
  );
};

export default ReadMore;
