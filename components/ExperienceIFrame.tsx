"use client";

import { useExperience } from "@/contexts/ExperienceContext";

export default function ExperienceIFrame({
  className = "",
}: {
  className?: string;
}) {
  const experience = useExperience();

  return (
    <div
      className={`absolute inset-0 z-0 h-full w-full dark:bg-black ${className}`}
      style={{
        opacity: experience.isIframeFullOpacity ? 1 : experience.iframeOpacity,
      }}
    >
      <iframe
        allow="camera; geolocation; microphone;"
        className="h-full w-full bg-black"
        srcDoc={experience.srcDoc}
        title="output"
        sandbox="allow-scripts"
        style={{
          transform: `scale(${experience.iframeScale})`,
          transformOrigin: "top left",
          width: `${(1 / experience.iframeScale) * 100}%`,
          height: `${(1 / experience.iframeScale) * 100}%`,
        }}
      />
    </div>
  );
}
