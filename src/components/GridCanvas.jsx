import React, { useRef, useEffect, useState } from "react";

const GridCanvas = ({ width = 500, height = 500, radius = 50 }) => {
  const canvasRef = useRef(null);
  const workerRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!HTMLCanvasElement.prototype.transferControlToOffscreen) {
      console.error("OffscreenCanvas is not supported in this browser.");
      return;
    }

    const offscreen = canvas.transferControlToOffscreen();
    console.log("Created: ", offscreen);
    const worker = new Worker(new URL("./renderWorker.js", import.meta.url));
    worker.postMessage({ canvas: offscreen, width, height }, [offscreen]);

    let previousPosition = null;

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const cx = Math.floor(event.clientX - rect.left);
      const cy = Math.floor(event.clientY - rect.top);

      worker.postMessage({
        position: { x: cx, y: cy },
        previousPosition,
        radius,
      });

      previousPosition = { x: cx, y: cy };
      setCursorPosition({ x: cx, y: cy });
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      worker.terminate();
    };
  }, [radius, width, height]);

  return (
    <div style={{ textAlign: "center" }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ border: "1px solid #000", cursor: "crosshair" }}
      />
      <p>
        Cursor Position: X: {cursorPosition.x}, Y: {cursorPosition.y}
      </p>
    </div>
  );
};

export default GridCanvas;
