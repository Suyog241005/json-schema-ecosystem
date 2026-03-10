"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { GithubIcon } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center font-bold transition-all duration-200 group-hover:shadow-lg group-hover:scale-105">
                JS
              </div>
              <span className="font-bold">JSON Schema Ecosystem</span>
            </Link>

            <div className="flex space-x-6">
              <Link
                href="/"
                className={cn(
                  "text-sm font-medium transition-all duration-200 hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/5",
                  pathname === "/"
                    ? "text-primary bg-primary/10 shadow-sm"
                    : "text-muted-foreground",
                )}
              >
                <div className="flex items-center gap-2">Metrics</div>
              </Link>
              <Link
                href="/repo"
                className={cn(
                  "text-sm font-medium transition-all duration-200 hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/5",
                  pathname === "/repo"
                    ? "text-primary bg-primary/10 shadow-sm"
                    : "text-muted-foreground",
                )}
              >
                <div className="flex items-center gap-2">Repositories</div>
              </Link>
              <Link
                href="/bowtie"
                className={cn(
                  "text-sm font-medium transition-all duration-200 hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/5",
                  pathname === "/bowtie"
                    ? "text-primary bg-primary/10 shadow-sm"
                    : "text-muted-foreground",
                )}
              >
                <div className="flex items-center gap-2">Bowtie</div>
              </Link>
              <Link
                href="/drafts"
                className={cn(
                  "text-sm font-medium transition-all duration-200 hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/5",
                  pathname === "/drafts"
                    ? "text-primary bg-primary/10 shadow-sm"
                    : "text-muted-foreground",
                )}
              >
                <div className="flex items-center gap-2">Drafts</div>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Link
              href="https://github.com/Suyog241005/json-schema-ecosystem"
              target="_blank"
            >
              <GithubIcon className="w-7 h-7 cursor-pointer" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
