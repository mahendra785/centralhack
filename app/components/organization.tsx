"use client";

import { useState, useEffect, useRef } from "react";
import type React from "react";
import Image from "next/image";
import bg from "../../public/BG.svg";
import FileUploadTest from "./upload";

const Organization: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef]);

  const features = [
    {
      name: "Live Video Stream",
      icon: "/feat1.svg",
      component: <FileUploadTest />,
    },
    {
      name: "History ",
      icon: "/feat2.svg",
      component: <div>History</div>,
    },
    {
      name: "Analytics",
      icon: "/feat3.svg",
      component: <div>Analytics</div>,
    },
    {
      name: "Organization",
      icon: "/feat4.svg",
      component: <div>Organization</div>,
    },
    {
      name: "ESG Reports",
      icon: "/feat5.svg",
      component: <div>ESG Reports</div>,
    },
    {
      name: "Custom Reports ",
      icon: "/feat6.svg",
      component: <div>Custom Reports</div>,
    },
    {
      name: "Performance Reports",
      icon: "/feat7.svg",
      component: <div>Performance Reports</div>,
    },
  ];

  return (
    <div className="flex-col relative w-full h-screen flex overflow-hidden bg-black">
      <Image
        src={bg || "/placeholder.svg"}
        alt="CentralHack"
        fill
        className="object-cover opacity-75"
        priority
      />
      {/* <div className="w-full flex justify-center z-20 deutschlander text-4xl md:text-6xl p-4">
        Sort IQ
      </div> */}
      <div className="flex items-center justify-center h-full w-full z-20 flex-col md:flex-row px-2 md:px-6 md:space-y-0 md:space-x-6 pb-4">
        {/* Sidebar */}

        {/* Main Content */}
        <div className="flex-1 h-full rounded-[24px] bg-[rgba(53,53,53,0.83)] flex justify-center backdrop-blur-[33.722px]">
          {activeFeature !== null && features[activeFeature].component}
        </div>
      </div>
    </div>
  );
};

export default Organization;
