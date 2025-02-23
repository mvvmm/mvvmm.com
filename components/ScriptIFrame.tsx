"use client";

import { useScript } from "@/contexts/ScriptContext";

export default function ScriptIFrame({
  className = "",
}: {
  className?: string;
}) {
  const script = useScript();
  return (
    <div
      className={`absolute inset-0 z-0 w-full h-full dark:bg-black ${className}`}
    >
      <iframe
        allow="camera; geolocation; microphone;"
        className="w-full h-full bg-black"
        srcDoc={script.srcDoc}
        title="output"
        sandbox="allow-scripts allow-same-origin"
        style={{
          transform: `scale(${script.scale})`,
          transformOrigin: "top left",
          width: `${(1 / script.scale) * 100}%`,
          height: `${(1 / script.scale) * 100}%`,
        }}
      />
    </div>
  );
}
