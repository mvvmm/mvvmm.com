"use client";

import { useCallback, useEffect, useRef } from "react";

const createGradientSwipe = (time: number) => {
  const size = 32;

  // Create a linear gradient that sweeps through the color spectrum
  const hue = (time * 50) % 360; // Complete color cycle every ~7 seconds
  const saturation = 80;
  const lightness = 60;

  return {
    hue,
    saturation,
    lightness,
    size,
  };
};

export default function FaviconCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateFavicon = useCallback((canvas: HTMLCanvasElement) => {
    const dataURL = canvas.toDataURL("image/png");
    const link =
      (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
      document.createElement("link");
    link.type = "image/png";
    link.rel = "shortcut icon";
    link.href = dataURL;
    document.getElementsByTagName("head")[0].appendChild(link);
  }, []);

  const drawGradientSwipe = useCallback(
    (ctx: CanvasRenderingContext2D, time: number) => {
      const gradientData = createGradientSwipe(time);
      const { hue, saturation, lightness, size } = gradientData;

      // Clear canvas with transparent background
      ctx.clearRect(0, 0, size, size);

      // Create linear gradient from left to right
      const gradient = ctx.createLinearGradient(size, 0, 0, 0);

      // Create color stops that sweep through the spectrum
      const color1 = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      const color2 = `hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness + 10}%)`;
      const color3 = `hsl(${(hue + 120) % 360}, ${saturation}%, ${lightness + 20}%)`;

      gradient.addColorStop(0, color1);
      gradient.addColorStop(0.5, color2);
      gradient.addColorStop(1, color3);

      // Draw the gradient square
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 32;
    canvas.height = 32;

    let animationId: number;

    let lastTime = 0;
    const targetFPS = 24;
    const frameInterval = 1000 / targetFPS; // ~41.67ms between frames

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        const time = currentTime * 0.001;
        // Draw gradient swipe with continuous color cycling
        drawGradientSwipe(ctx, time);
        updateFavicon(canvas);
        lastTime = currentTime;
      }
      animationId = requestAnimationFrame(animate);
    };

    // Start animation
    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [drawGradientSwipe, updateFavicon]);

  return <canvas ref={canvasRef} className="hidden" width={32} height={32} />;
}
