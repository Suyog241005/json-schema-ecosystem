"use client";

import { useEffect, useRef } from "react";
import { 
  Chart, 
  registerables, 
  ChartConfiguration,
  ChartTypeRegistry
} from "chart.js";

Chart.register(...registerables);

interface ChartContainerProps {
  config: ChartConfiguration<keyof ChartTypeRegistry>;
  height?: number | string;
}

export function ChartContainer({ config, height = 300 }: ChartContainerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      chartRef.current = new Chart(canvasRef.current, config);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [config]);

  return (
    <div style={{ height, position: "relative", width: "100%" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
