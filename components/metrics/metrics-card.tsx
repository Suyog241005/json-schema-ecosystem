"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { MetricsOutput } from "@/scripts/metrics";

const npmUrl = "https://npmjs.com/package/";

export const MetricsCard = ({ data }: { data: MetricsOutput }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3">
      <Link
        href={`${npmUrl}${data?.ajv.package}`}
        target="_blank"
        className="cursor-pointer"
      >
        <Card className="relative overflow-hidden border-0 shadow-lg bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="relative pb-2">
            <CardTitle className="text-xl font-medium text-blue-900 dark:text-blue-100">
              npm weekly downloads
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300 text-xs truncate">
              {data?.ajv.package}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
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
            <CardTitle className="text-xl font-medium text-blue-900 dark:text-blue-100">
              npm weekly downloads
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300 text-xs truncate">
              {data?.jsonschema.package}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
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
            <CardTitle className="text-xl font-medium text-blue-900 dark:text-blue-100">
              npm weekly downloads
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300 text-xs truncate">
              {data?.hyperjump.package}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
              {data?.hyperjump.weeklyDownloads.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};
