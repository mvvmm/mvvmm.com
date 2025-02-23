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
      className={`absolute inset-0 z-0 w-full h-full dark:bg-black ${className}`}
    >
      <iframe
        allow="camera; geolocation; microphone;"
        className="w-full h-full bg-black"
        srcDoc={experience.srcDoc}
        title="output"
        sandbox="allow-scripts allow-same-origin"
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
