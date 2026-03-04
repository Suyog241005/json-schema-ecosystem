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
import Link from "next/link";

const npmUrl = "https://npmjs.com/package/";

export default function MetricsPage() {
  const [data, setData] = useState<MetricsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              color: () => {
                const isDark = window.localStorage.getItem("theme") === "dark";
                return isDark ? "white" : "black";
              },
              font: {
                size: 14,
              },
              anchor: "end",
              align: "top",
              formatter: (value) => value.toLocaleString(),
              textStrokeColor: () => {
                const isDark = window.localStorage.getItem("theme") === "dark";
                return isDark ? "white" : "black";
              },
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
          tooltip: {
            backgroundColor: "hsl(0, 0%, 9%)",
            titleColor: "hsl(0, 0%, 98%)",
            bodyColor: "hsl(0, 0%, 78%)",
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
          },
        },
        scales: {
          x: {
            ticks: {
              color: "hsl(0, 0%, 45%)",
              font: {
                size: 12,
              },
            },
          },
          y: {
            grid: {
              color: "hsl(0, 0%, 22%)",
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
  }, [data]);

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
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href={`${npmUrl}${data?.ajv.package}`}
              target="_blank"
              className="cursor-pointer"
            >
              <Card className="relative overflow-hidden border-0 shadow-lg bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <CardHeader className="relative pb-2">
                  <CardTitle className="text-lg font-medium text-blue-900 dark:text-blue-100">
                    npm weekly downloads
                  </CardTitle>
                  <CardDescription className="text-blue-700 dark:text-blue-300">
                    {data?.ajv.package}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {data?.ajv.weeklyDownloads.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link
              href={`${npmUrl}${data?.jsonschema.package}`}
              target="_blank"
              className="cursor-pointer"
            >
              <Card className="relative overflow-hidden border-0 shadow-lg bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <CardHeader className="relative pb-2">
                  <CardTitle className="text-lg font-medium text-blue-900 dark:text-blue-100">
                    npm weekly downloads
                  </CardTitle>
                  <CardDescription className="text-blue-700 dark:text-blue-300">
                    {data?.jsonschema.package}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {data?.jsonschema.weeklyDownloads.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link
              href={`${npmUrl}${data?.hyperjump.package}`}
              target="_blank"
              className="cursor-pointer"
            >
              <Card className="relative overflow-hidden border-0 shadow-lg bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <CardHeader className="relative pb-2">
                  <CardTitle className="text-lg font-medium text-blue-900 dark:text-blue-100">
                    npm weekly downloads
                  </CardTitle>
                  <CardDescription className="text-blue-700 dark:text-blue-300">
                    {data?.hyperjump.package}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {data?.hyperjump.weeklyDownloads.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Chart Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Visual Overview</CardTitle>
              <CardDescription>
                Compare key ecosystem metrics at a glance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <canvas id="metricsChart" className="w-full h-full"></canvas>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-8">
            <p>Data fetched from npm and GitHub APIs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
