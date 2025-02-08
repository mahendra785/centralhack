"use client";

import { useState, useEffect, useRef } from "react";
import type React from "react";
import Image from "next/image";
import bg from "../../public/BG.svg";
import FileUploadTest from "./upload";

const Organization: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

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
  }, [sidebarRef]); // Added sidebarRef to dependencies

  const features = [
    { name: "Feature 1", icon: "/feat1.svg", component: <FileUploadTest /> },
    {
      name: "Feature 2",
      icon: "/feat2.svg",
      component: <div>Feature 2 Content</div>,
    },
    {
      name: "Feature 3",
      icon: "/feat3.svg",
      component: <div>Feature 3 Content</div>,
    },
    {
      name: "Feature 4",
      icon: "/feat4.svg",
      component: <div>Feature 4 Content</div>,
    },
    {
      name: "Feature 5",
      icon: "/feat5.svg",
      component: <div>Feature 5 Content</div>,
    },
    {
      name: "Feature 6",
      icon: "/feat6.svg",
      component: <div>Feature 6 Content</div>,
    },
    {
      name: "Feature 7",
      icon: "/feat7.svg",
      component: <div>Feature 7 Content</div>,
    },
  ];

  return (
    <div className="flex-col relative w-screen h-screen flex overflow-hidden bg-black">
      <Image
        src={bg || "/placeholder.svg"}
        alt="CentralHack"
        fill
        className="object-cover opacity-75"
      />
      <div className="w-full flex justify-center z-20 deutschlander text-6xl">
        Sort IQ
      </div>
      <div className="h-full w-full z-20 flex flex-row pl-6 space-x-6">
        {/* Left Box (Sidebar) */}
        <div
          ref={sidebarRef}
          className={`transition-all ease-in-out h-[90vh] ${
            isExpanded ? "w-[15vw]" : "w-[6vw]"
          } rounded-[24px] bg-[rgba(53,53,53,0.83)] flex justify-center items-start pt-4 rounded-b-[24px] backdrop-blur-[33.722px]`}
        >
          {isExpanded ? (
            <div>
              <div className="flex flex-row items-center space-x-2">
                <Image
                  src="/expanded.svg"
                  alt="expand"
                  width={70}
                  height={70}
                  className="hover:scale-[1.04] cursor-pointer"
                  onClick={() => setIsExpanded(!isExpanded)}
                />
                <div className="deutschlander text-5xl">Features</div>
              </div>
              <div className="flex flex-col space-y-6 mt-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => setActiveFeature(index)}
                  >
                    <Image
                      src={feature.icon || "/placeholder.svg"}
                      alt={feature.name}
                      width={70}
                      height={70}
                      className="hover:scale-[1.04]"
                    />
                    <div>{feature.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <Image
                src="/expand.svg"
                alt="expand"
                width={60}
                height={60}
                className="hover:scale-[1.04] cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              />
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => setActiveFeature(index)}
                >
                  <Image
                    src={feature.icon || "/placeholder.svg"}
                    alt={feature.name}
                    width={60}
                    height={60}
                    className="hover:scale-[1.04] pt-2"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Box */}
        <div className="w-[90vw] pr-4 h-[90vh] rounded-b-[24px] rounded-[24px] bg-[rgba(53,53,53,0.83)] flex justify-center backdrop-blur-[33.722px]">
          {activeFeature !== null && features[activeFeature].component}
        </div>
      </div>
    </div>
  );
};

export default Organization;
