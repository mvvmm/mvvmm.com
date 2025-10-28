"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { useRef, useState } from "react";
import { useExperience } from "@/contexts/ExperienceContext";

export default function Opacity() {
  const experience = useExperience();

  const [showSlider, setShowSlider] = useState(false);

  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setShowSlider(true);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setShowSlider(false);
    }, 200);
  };

  return (
    <div
      className="relative z-10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`absolute inset-0 h-[${showSlider ? "300px" : "24px"}]`}
      ></div>

      <input
        type="range"
        value={experience.iframeOpacity * 100}
        onChange={(v) =>
          experience.updateIframeOpacity(v.target.valueAsNumber / 100)
        }
        className={`absolute left-0 top-8 z-20 h-24 w-full cursor-pointer transition-all duration-300 ease-in-out ${showSlider ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
        style={{
          writingMode: "vertical-lr", // Standard vertical layout
          WebkitAppearance: "slider-vertical", // Safari & Chrome
          transform: "rotate(180deg)", // Flips so up is up, down is down
        }}
      />

      <button
        type="button"
        className="relative z-30 h-full bg-zinc-900 hover:cursor-pointer hover:text-zinc-200"
        onClick={experience.toggleIframeOpacity}
      >
        {experience.iframeOpacity === 1 ? (
          <EyeIcon className="mx-1 size-[24px]" />
        ) : (
          <EyeSlashIcon className="mx-1 size-[24px]" />
        )}
      </button>
    </div>
  );
}
