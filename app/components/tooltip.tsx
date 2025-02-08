"use client";

import React, { useState, useRef, useEffect } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      // Position the tooltip below the icon
      setPosition({
        top: triggerRect.bottom + window.scrollY + 10, // 10px below the trigger
        left:
          triggerRect.left +
          window.scrollX +
          triggerRect.width / 2 - // Centered horizontally based on the trigger
          tooltipRect.width / 2,
      });
    }
  }, [isVisible]);

  return (
    <div
      ref={triggerRef}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className="relative inline-block"
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="absolute z-50 px-3 py-2 text-sm font-bold text-white bg-black bg-opacity-80 rounded-lg shadow-lg transition-opacity duration-300"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            opacity: isVisible ? 1 : 0,
          }}
        >
          {content}
          <div
            className="absolute w-3 h-3 bg-black bg-opacity-80 transform rotate-45"
            style={{
              top: "-6px",
              left: "50%",
              marginLeft: "-6px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
