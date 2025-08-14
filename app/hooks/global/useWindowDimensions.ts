import { useState, useEffect } from "react";

interface WindowDimensions {
  windowWidth: number;
  windowHeight: number;
}

function getWindowDimensions(): WindowDimensions {
  if (typeof window !== "undefined") {
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    return { windowWidth, windowHeight };
  }
  return { windowWidth: 0, windowHeight: 0 }; // Default values for SSR
}

export default function useWindowDimensions(): WindowDimensions {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
    windowWidth: 0,
    windowHeight: 0, // Default values to avoid SSR mismatch
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    // Set initial dimensions after mounting
    setWindowDimensions(getWindowDimensions());
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
