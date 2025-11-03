"use client";

import { useEffect } from "react";
import { useExperience } from "@/contexts/ExperienceContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export default function ExperienceIFrame({
  className = "",
}: {
  className?: string;
}) {
  const experience = useExperience();
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: "50px", // Start loading 50px before it comes into view
  });

  // Update iframe playing state based on visibility
  useEffect(() => {
    experience.setIframeInView(isIntersecting);
  }, [isIntersecting, experience]);

  // Listen for errors from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify message type and handle error messages
      if (event.data && event.data.type === "EXPERIENCE_ERROR") {
        experience.addError(event.data.error);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [experience.addError]);

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`absolute inset-0 z-0 h-full w-full dark:bg-black ${className}`}
      style={{
        opacity: experience.iframeOpacity === 1 ? 1 : experience.iframeOpacity,
      }}
    >
      <iframe
        ref={experience.iframeRef}
        allow="camera; geolocation; microphone;"
        className="h-full w-full bg-black"
        srcDoc={experience.isIframePlaying ? experience.srcDoc : ""}
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
