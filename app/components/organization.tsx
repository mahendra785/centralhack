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
    <div className="flex-col relative w-full min-h-screen flex overflow-hidden bg-black">
      <Image
        src={bg || "/placeholder.svg"}
        alt="CentralHack"
        fill
        className="object-cover opacity-75"
        priority
      />
      <div className="w-full flex justify-center z-20 deutschlander text-4xl md:text-6xl p-4">
        Sort IQ
      </div>
      <div className="h-full w-full z-20 flex flex-col md:flex-row px-2 md:px-6 space-y-4 md:space-y-0 md:space-x-6 pb-4">
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`transition-all ease-in-out ${
            isMobile ? "w-full h-auto" : "h-[88vh]"
          } ${
            isExpanded ? "md:w-[15vw]" : "md:w-[6vw]"
          } rounded-[24px] bg-[rgba(53,53,53,0.83)] flex justify-center items-start pt-4 rounded-b-[24px] backdrop-blur-[33.722px]`}
        >
          {isExpanded && !isMobile ? (
            <div className="w-full">
              <div className="flex flex-row items-center pl-4 space-x-2">
                <Image
                  src="/expanded.svg"
                  alt="expand"
                  width={70}
                  height={70}
                  className="hover:scale-[1.04] cursor-pointer"
                  onClick={() => setIsExpanded(!isExpanded)}
                />
                <div className="deutschlander text-3xl md:text-5xl">
                  Features
                </div>
              </div>
              <div className="flex flex-col space-y-6 mt-4 pb-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center pl-4 space-x-2 cursor-pointer"
                    onClick={() => setActiveFeature(index)}
                  >
                    <Image
                      src={feature.icon || "/placeholder.svg"}
                      alt={feature.name}
                      width={70}
                      height={70}
                      className="hover:scale-[1.04]"
                    />
                    <div className="text-sm md:text-base">{feature.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className={`flex ${
                isMobile ? "flex-row justify-around w-full pb-4" : "flex-col"
              } space-y-0 md:space-y-4`}
            >
              {!isMobile && (
                <Image
                  src="/expand.svg"
                  alt="expand"
                  width={60}
                  height={60}
                  className="hover:scale-[1.04] cursor-pointer"
                  onClick={() => setIsExpanded(!isExpanded)}
                />
              )}
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => setActiveFeature(index)}
                >
                  <Image
                    src={feature.icon || "/placeholder.svg"}
                    alt={feature.name}
                    width={isMobile ? 40 : 60}
                    height={isMobile ? 40 : 60}
                    className="hover:scale-[1.04] pt-2"
                  />
                  {isMobile && (
                    <div className="text-xs mt-1">{feature.name}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-[50vh] md:h-[88vh] rounded-[24px] bg-[rgba(53,53,53,0.83)] flex justify-center backdrop-blur-[33.722px]">
          {activeFeature !== null && features[activeFeature].component}
        </div>
      </div>
    </div>
  );
};

export default Organization;
