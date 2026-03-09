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

interface BowtieData {
  implementations: {
    [key: string]: {
      totalTests: number;
      passedTests: number;
      failedTests: number;
      scorePercentage: number;
    };
  };
  metadata: {
    generated: string;
    testSuite: string;
    dialect: string;
    totalImplementations: number;
  };
}

export const BowtiePageContent = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [bowtieData, setBowtieData] = useState<BowtieData | null>(null);
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
    const fetchData = async () => {
      try {
        const response = await fetch("/api/bowtie");
        if (!response.ok) {
          throw new Error("Failed to fetch bowtie scores");
        }
        const data = await response.json();
        setBowtieData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!bowtieData || loading) return;

    const ctx = document.getElementById("bowtieChart") as HTMLCanvasElement;
    if (!ctx) return;

    // Sort implementations by score percentage
    const sortedImplementations = Object.entries(
      bowtieData.implementations,
    ).sort(([, a], [, b]) => b.scorePercentage - a.scorePercentage);

    const labels = sortedImplementations.map(([name]) => name);
    const scores = sortedImplementations.map(
      ([, data]) => data.scorePercentage,
    );

    // Color coding based on performance
    const colors = scores.map((score) => {
      if (score === 100) return "hsl(142, 71%, 45%)"; // Green
      if (score >= 95) return "hsl(38, 92%, 50%)"; // Yellow
      return "hsl(0, 84%, 60%)"; // Red
    });

    const textColor = theme === "dark" ? "hsl(0, 0%, 85%)" : "hsl(0, 0%, 25%)";
    const gridColor = theme === "dark" ? "hsl(0, 0%, 22%)" : "hsl(0, 0%, 88%)";

    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Score Percentage",
            data: scores,
            backgroundColor: colors,
            borderColor: colors.map((color) =>
              color.replace("hsl", "hsla").replace(")", ", 0.8)"),
            ),
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "JSON Schema Implementation Bowtie Scores",
            color: textColor,
            font: {
              size: 16,
              weight: "bold",
            },
          },
          tooltip: {
            callbacks: {
              afterLabel: function (context) {
                const index = context.dataIndex;
                const implName = labels[index];
                const implData = bowtieData.implementations[implName];
                return [
                  `Total Tests: ${implData.totalTests}`,
                  `Passed: ${implData.passedTests}`,
                  `Failed: ${implData.failedTests}`,
                ];
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: "Score Percentage (%)",
              color: textColor,
            },
            ticks: {
              color: textColor,
              callback: function (value) {
                return value + "%";
              },
            },
            grid: {
              color: gridColor,
            },
          },
          y: {
            ticks: {
              color: textColor,
              font: {
                size: 14,
              },
            },
            grid: {
              color: gridColor,
            },
          },
        },
      },
    });

    return () => {
      myChart.destroy();
    };
  }, [bowtieData, loading, theme]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-lg">Loading bowtie scores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  const perfectScores = bowtieData
    ? Object.values(bowtieData.implementations).filter(
        (impl) => impl.scorePercentage === 100,
      ).length
    : 0;
  const highPerformers = bowtieData
    ? Object.values(bowtieData.implementations).filter(
        (impl) => impl.scorePercentage >= 95 && impl.scorePercentage < 100,
      ).length
    : 0;
  const needsImprovement = bowtieData
    ? Object.values(bowtieData.implementations).filter(
        (impl) => impl.scorePercentage < 95,
      ).length
    : 0;

  return (
    <div className="h-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bowtie Test Results</h1>
          <p className="text-muted-foreground">
            JSON Schema implementation compliance scores based on bowtie test
            suite
          </p>
          {bowtieData && (
            <div className="mt-2 text-sm text-muted-foreground">
              <span>
                Generated: {bowtieData.metadata.generated.split("T")[0]}
              </span>
              <span className="mx-2">•</span>
              <span>
                Total Implementations:{" "}
                {bowtieData.metadata.totalImplementations}
              </span>
              <span className="mx-2">•</span>
              <span>
                Test Suite: {bowtieData.metadata.testSuite} (
                {bowtieData.metadata.dialect})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Perfect Scores
            </CardTitle>
            <div className="h-4 w-4 text-green-600">●</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {perfectScores}
            </div>
            <p className="text-xs text-muted-foreground">100% compliance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              High Performers
            </CardTitle>
            <div className="h-4 w-4 text-yellow-600">●</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {highPerformers}
            </div>
            <p className="text-xs text-muted-foreground">95-99% compliance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Needs Improvement
            </CardTitle>
            <div className="h-4 w-4 text-red-600">●</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {needsImprovement}
            </div>
            <p className="text-xs text-muted-foreground">&lt;95% compliance</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Scores</CardTitle>
          <CardDescription>
            Horizontal bar chart showing compliance scores for each JSON Schema
            implementation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[750px] w-full">
            <canvas id="bowtieChart"></canvas>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
