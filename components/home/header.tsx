"use client";
import Link from "next/link";
import { ModeToggle } from "../mode-toggle";

export const Header = () => {
  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6">
        <div className="space-y-1">
          <Link href="/">
            <h1 className="text-2xl font-semibold tracking-tight">
              JSON Schema Ecosystem
            </h1>
          </Link>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
};
