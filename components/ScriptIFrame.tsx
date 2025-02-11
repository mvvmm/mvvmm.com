"use client";

import { useScript } from "@/contexts/ScriptContext";

export default function ScriptIFrame() {
  const script = useScript();
  return (
    <div className="absolute inset-0 z-0">
      <iframe
        allow="camera; geolocation; microphone;"
        className="w-full h-full"
        srcDoc={script.srcDoc}
        title="output"
        sandbox="allow-scripts"
        width="100%"
        height="100%"
      />
    </div>
  );
}
