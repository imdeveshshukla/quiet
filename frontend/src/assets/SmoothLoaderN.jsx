const SmoothLoaderN = () => {
    return (
      <svg
        width="28px"
        height="28px"
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
            values="#3498db;#e74c3c;#f9ca24;#6ab04c;#3498db"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    );
  };
  
  export default SmoothLoaderN;
  