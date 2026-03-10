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
import Link from "next/link";

interface Draft {
  draft: string;
  count: number;
  url: string;
}

export const DraftsPageContent = ({ drafts }: { drafts: Draft[] }) => {
  if (!drafts) {
    return (
      <div className="h-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">JSON Schema Draft Adoption</h1>
            <p className="text-muted-foreground">
              Distribution of JSON Schema draft versions
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Draft Distribution</CardTitle>
            <CardDescription>
              Pie chart showing the adoption distribution of different JSON
              Schema draft versions
            </CardDescription>
          </CardHeader>
          <CardContent>No drafts data available</CardContent>
        </Card>
      </div>
    );
  }
  const [theme, setTheme] = useState<"light" | "dark">("dark");

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
    if (!drafts || drafts.length === 0) return;

    const ctx = document.getElementById("draftsChart") as HTMLCanvasElement;
    if (!ctx) return;

    const labels = drafts.map((d) => d.draft);
    const data = drafts.map((d) => d.count);

    // Color palette for different drafts
    const colors = [
      "hsl(221, 83%, 53%)", // Blue
      "hsl(142, 71%, 45%)", // Green
      "hsl(38, 92%, 50%)", // Yellow
      "hsl(340, 82%, 62%)", // Red
      "hsl(280, 70%, 60%)", // Purple
    ];

    const textColor = theme === "dark" ? "hsl(0, 0%, 85%)" : "hsl(0, 0%, 25%)";

    const myChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors.slice(0, drafts.length),
            borderColor:
              theme === "dark" ? "hsl(0, 0%, 30%)" : "hsl(0, 0%, 90%)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "right",
            labels: {
              color: textColor,
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12,
              },
            },
          },
          title: {
            display: true,
            text: "JSON Schema Draft Adoption",
            color: textColor,
            font: {
              size: 16,
              weight: "bold",
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.parsed as number;
                const total = context.dataset.data.reduce(
                  (a: number, b: number) => a + b,
                  0,
                );
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value.toLocaleString()} reference (${percentage}%)`;
              },
            },
          },
        },
      },
    });

    return () => {
      myChart.destroy();
    };
  }, [drafts, theme]);

  const totalReferences = drafts
    ? drafts.reduce((sum, draft) => sum + draft.count, 0)
    : 0;

  return (
    <div className="h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">JSON Schema Draft Adoption</h1>
          <p className="text-muted-foreground">
            Distribution of JSON Schema draft versions
          </p>
          {drafts && (
            <div className="mt-2 text-sm text-muted-foreground">
              <span>Total References: {totalReferences.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        {drafts.map((draft) => (
          <Link key={draft.draft} href={`${draft.url}`} target="_blank">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {draft.draft}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {draft.count.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">references</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Draft Distribution</CardTitle>
          <CardDescription>
            Pie chart showing the adoption distribution of different JSON Schema
            draft versions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <canvas id="draftsChart"></canvas>
          </div>
        </CardContent>
      </Card>

      {/* Detailed List */}
      <Card>
        <CardHeader>
          <CardTitle>Draft Details</CardTitle>
          <CardDescription>
            Detailed breakdown of reference counts for each draft version
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {drafts &&
              drafts.map((draft, index) => {
                const percentage =
                  totalReferences > 0
                    ? ((draft.count / totalReferences) * 100).toFixed(1)
                    : "0";
                const colors = [
                  "bg-blue-500",
                  "bg-green-500",
                  "bg-yellow-500",
                  "bg-red-500",
                  "bg-purple-500",
                ];
                return (
                  <div
                    key={draft.draft}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`}
                      ></div>
                      <span className="font-medium">{draft.draft}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {percentage}%
                      </span>
                      <span className="font-semibold">
                        {draft.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
