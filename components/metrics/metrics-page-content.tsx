"use client";

import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import ChartDatalabels from "chartjs-plugin-datalabels";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MetricsOutput } from "@/scripts/metrics";
import { MetricsCard } from "./metrics-card";

export function MetricsPageContent() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [data, setData] = useState<MetricsOutput | null>(null);
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

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch("/api/metrics")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch metrics");
        return r.json() as Promise<MetricsOutput>;
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!data) return;
    const ctx = document.getElementById("metricsChart") as HTMLCanvasElement;
    if (!ctx) return;

    const gridColor = theme === "dark" ? "hsl(0, 0%, 22%)" : "hsl(0, 0%, 88%)";

    var myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          `${data.ajv.package}`,
          `${data.jsonschema.package}`,
          `${data.hyperjump.package}`,
        ].filter(Boolean),
        datasets: [
          {
            data: [
              data.ajv.weeklyDownloads,
              data.jsonschema.weeklyDownloads,
              data.hyperjump.weeklyDownloads,
            ].filter((v) => typeof v === "number"),
            backgroundColor: [
              "hsl(221, 83%, 53%)",
              "hsl(142, 71%, 45%)",
              "hsl(340, 82%, 62%)",
            ],
            borderRadius: 8,
            borderSkipped: false,
            barPercentage: 0.4,
            datalabels: {
              color: theme === "dark" ? "white" : "black",
              font: {
                size: 14,
              },
              anchor: "end",
              align: "top",
              formatter: (value) => value.toLocaleString(),
              textStrokeColor: theme === "dark" ? "white" : "black",
              textStrokeWidth: 1,
              padding: 4,
              offset: -5,
            },
          },
        ],
      },
      plugins: [ChartDatalabels],
      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: {
              color: "hsl(0, 0%, 45%)",
              font: {
                size: 12,
              },
            },
          },
          y: {
            grid: {
              color: gridColor,
            },
            ticks: {
              color: "hsl(0, 0%, 45%)",
              font: {
                size: 10,
              },
            },
          },
        },
      },
    });
    return () => {
      myChart.destroy();
    };
  }, [data, theme]);

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading metrics…</div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-destructive">Error: {error}</div>
      </div>
    );

  return (
    <div className="h-full bg-linear-to-br from-background via-background to-muted/20">
      <div className="mx-auto">
        {/* Metrics Cards */}
        {data ? <MetricsCard data={data} /> : null}

        {/* Chart Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Visual Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <canvas id="metricsChart" className="w-full h-full"></canvas>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8">
          <p>Data fetched from npm APIs</p>
        </div>
      </div>
    </div>
  );
}
