"use client";

import { motion } from "framer-motion";
import { InsightNav } from "@/components/insights/insight-nav";

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-7xl py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/60">
            Ecosystem Pulse
          </h1>
          <p className="text-muted-foreground text-lg">
            Deep-dive metrics into the health, maintenance, and community momentum of JSON Schema.
          </p>
        </div>

        <InsightNav />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
