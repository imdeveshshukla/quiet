const SmoothLoaderHome = () => {
    return (
      <svg
        width="36px"
        height="36px"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="100"
          strokeDashoffset="0"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="100;0"
            dur="0.7s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke"
            values="#727a06;#8b9322;#959b41;#afb467;#e2e4c6"
            dur="1s"
            repeatCount="indefinite"
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
