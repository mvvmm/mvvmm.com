"use client";

import { useScript } from "@/contexts/ScriptContext";

export default function ScriptIFrame() {
  const script = useScript();
  return (
    <div className="absolute inset-0 z-0 w-full h-full dark:bg-black">
      <iframe
        allow="camera; geolocation; microphone;"
        className="w-full h-full z-10 bg-black"
        srcDoc={script.srcDoc}
        title="output"
        sandbox="allow-scripts allow-same-origin"
        width="100%"
        height="100%"
      />
    </div>
  );
}
