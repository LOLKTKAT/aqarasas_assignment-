"use client";
import { useState, useEffect } from "react";

function useWindowWidth() {
  // Initialize state with current window width
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures this effect only runs on mount and unmount

  return width;
}

export default useWindowWidth;
