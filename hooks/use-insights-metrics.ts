"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { EcosystemInsights } from "@/lib/insights.types";

export function useInsightsMetrics() {
  const [data, setData] = useState<EcosystemInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get("/api/insights")
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
