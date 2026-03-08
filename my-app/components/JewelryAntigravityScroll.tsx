"use client";

import { useEffect, useRef } from "react";
import { useScroll, useSpring, useTransform } from "framer-motion";

interface JewelryAntigravityScrollProps {
  frameCount: number;
}

export default function JewelryAntigravityScroll({ frameCount = 40 }: JewelryAntigravityScrollProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const images: HTMLImageElement[] = [];
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        const frameIndex = i.toString().padStart(3, "0");
        const imagePath = `/frames/frames/ezgif-frame-${frameIndex}.jpg`;
        img.src = imagePath;

        // Wait for image to load before adding to array to ensure smooth playback
        await new Promise((resolve) => {
          img.onload = () => {
            images.push(img);
            resolve(true);
          };
          img.onerror = () => {
            console.warn(`Failed to load image: ${imagePath}`);
            resolve(false);
          };
        });
      }
      imagesRef.current = images;

      // Draw initial frame
      if (images.length > 0 && canvasRef.current) {
        drawFrame(0);
      }
    };

    preloadImages();
  }, [frameCount]);

  // Scroll logic
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Apply smoothing for "antigravity" inertia effect
  const smoothedProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Map progress to frame index
  const frameIndex = useTransform(smoothedProgress, [0, 1], [0, frameCount - 1]);

  useEffect(() => {
    return frameIndex.onChange((latest) => {
      const index = Math.min(Math.max(Math.floor(latest), 0), frameCount - 1);
      drawFrame(index);
    });
  }, [frameIndex, frameCount]);

  const drawFrame = (index: number) => {
    if (!canvasRef.current || !imagesRef.current[index]) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[index];

    // Ensure canvas dimensions match and account for device pixel ratio (sharp resolution)
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate aspect ratio preserving dimensions (object-contain)
    const renderRatio = Math.min(canvas.width / img.width, canvas.height / img.height);
    const renderWidth = img.width * renderRatio;
    const renderHeight = img.height * renderRatio;

    // Center image
    const x = (canvas.width - renderWidth) / 2;
    const y = (canvas.height - renderHeight) / 2;

    ctx.drawImage(img, x, y, renderWidth, renderHeight);
  };

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full bg-[#050505] z-0">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
