"use client";

import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver({
  threshold = 0,
  rootMargin = "0px",
  freezeOnceVisible = false,
}: UseIntersectionObserverOptions = {}) {
  // Initialize to true - assume element is visible until observer confirms otherwise
  // This prevents issues on mobile where intersection observer may fire late
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check initial visibility synchronously before setting up observer
    // This helps on mobile where intersection observer may be delayed
    const rect = element.getBoundingClientRect();
    const isInitiallyVisible = 
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0;
    
    if (isInitiallyVisible) {
      setIsIntersecting(true);
      setHasIntersected(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;

        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }

        if (!freezeOnceVisible || !hasIntersected) {
          setIsIntersecting(isElementIntersecting);
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, freezeOnceVisible, hasIntersected]);

  return { elementRef, isIntersecting, hasIntersected };
}
