const SmoothLoaderHome = () => {
    return (
      <svg
        width="24px"
        height="24px"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        color='#6c712eb8'
      >
        <circle
          cx="50"
          cy="50"
          r="32"
          strokeWidth="8"
          stroke="currentColor"
          strokeDasharray="50.26548245743669 50.26548245743669"
          fill="none"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="100;0"
            dur="0.7s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="1s"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
          />
        </circle>
      </svg>
    );
  };
  
  export default SmoothLoaderHome;
  

  import React from 'react';
import { VscFoldDown } from 'react-icons/vsc';

export const AnimatedFoldDownArrow = () => {
  return (
    <div className="animated-arrow-container">
      <VscFoldDown className="animated-arrow" />
      <style>
        {`
          .animated-arrow {
            font-size: 24px;  /* Size of the arrow */
            color: #6d712eb8; /* Color matching your theme */
            animation: bounce 1s infinite ease-in-out;
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(3px);
            }
            60% {
              transform: translateY(0px);
            }
          }
        `}
      </style>
    </div>
  );
};
