import { useEffect, useRef, useState } from "react"
import type { RoughCanvas } from "roughjs/bin/canvas";
import rough from "roughjs";


export default function App() {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [roughCanvas, setRoughCanvas] = useState<RoughCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    setRoughCanvas(rough.canvas(canvasRef.current));
    roughCanvas?.line(60, 60, 190, 60);
    roughCanvas?.rectangle(10, 10, 100, 100)
  }, [roughCanvas]);

  return (
    <canvas ref={canvasRef}>

    </canvas>
  )
}
