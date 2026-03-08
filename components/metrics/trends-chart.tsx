"use client";

import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TrendData {
  timestamp: string;
  ajv: number;
  jsonschema: number;
  hyperjump: number;
}

export const TrendsChart = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateTheme = () => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        window.localStorage.getItem("theme") === "dark";
      setTheme(isDark ? "dark" : "light");
    };

    updateTheme();

    // Listen for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const loadTrendData = async () => {
      try {
        setLoading(true);
        const sampleData: TrendData[] = [
          {
            timestamp: "2026-02-01",
            ajv: 245000000,
            jsonschema: 5400000,
            hyperjump: 280000,
          },
          {
            timestamp: "2026-02-15",
            ajv: 250000000,
            jsonschema: 5500000,
            hyperjump: 290000,
          },
          {
            timestamp: "2026-03-01",
            ajv: 255000000,
            jsonschema: 5600000,
            hyperjump: 295000,
          },
          {
            timestamp: "2026-03-08",
            ajv: 258381792,
            jsonschema: 5650493,
            hyperjump: 300874,
          },
        ];
        setTrendData(sampleData);
      } catch (err) {
        setError("Failed to load trend data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTrendData();
  }, []);

  useEffect(() => {
    if (!trendData.length || loading) return;

    const ctx = document.getElementById("trendsChart") as HTMLCanvasElement;
    if (!ctx) return;

    const textColor = theme === "dark" ? "hsl(0, 0%, 85%)" : "hsl(0, 0%, 25%)";
    const gridColor = theme === "dark" ? "hsl(0, 0%, 22%)" : "hsl(0, 0%, 88%)";

    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: trendData.map((d) => {
          const date = new Date(d.timestamp);
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        }),
        datasets: [
          {
            label: "ajv",
            data: trendData.map((d) => d.ajv),
            borderColor: "hsl(221, 83%, 53%)",
            backgroundColor: "hsl(221, 83%, 53%, 0.1)",
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: "hsl(221, 83%, 53%)",
            pointBorderColor: theme === "dark" ? "white" : "black",
            pointBorderWidth: 2,
          },
          {
            label: "jsonschema",
            data: trendData.map((d) => d.jsonschema),
            borderColor: "hsl(142, 71%, 45%)",
            backgroundColor: "hsl(142, 71%, 45%, 0.1)",
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: "hsl(142, 71%, 45%)",
            pointBorderColor: theme === "dark" ? "white" : "black",
            pointBorderWidth: 2,
          },
          {
            label: "@hyperjump/json-schema",
            data: trendData.map((d) => d.hyperjump),
            borderColor: "hsl(340, 82%, 62%)",
            backgroundColor: "hsl(340, 82%, 62%, 0.1)",
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: "hsl(340, 82%, 62%)",
            pointBorderColor: theme === "dark" ? "white" : "black",
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: textColor,
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
              },
            },
          },
          title: {
            display: true,
            text: "Weekly Download Trends",
            color: textColor,
          },
        },
        scales: {
          x: {
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
              font: {
                size: 11,
              },
            },
          },
          y: {
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
              font: {
                size: 11,
              },
            },
          },
        },
      },
    });

    return () => {
      myChart.destroy();
    };
  }, [trendData, theme, loading]);

  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Weekly Download Trends</CardTitle>
          <CardDescription>Historical npm download trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full flex items-center justify-center">
            <div className="text-muted-foreground">Loading trends...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Weekly Download Trends</CardTitle>
          <CardDescription>Historical npm download trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full flex items-center justify-center">
            <div className="text-destructive">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        {/* <CardTitle className="text-xl">Weekly Download Trends</CardTitle>
        <CardDescription>Historical npm download trends</CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <canvas id="trendsChart" className="w-full h-full"></canvas>
        </div>
      </CardContent>
    </Card>
  );
};
