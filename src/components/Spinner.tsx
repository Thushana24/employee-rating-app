"use client";

import React from "react";
import { cn } from "@/utilities/cn";

interface SpinnerProps {
  size?: number;
  className?: string;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 16,
  className,
  color = "border-white",
}) => {
  return (
    <div
      className={cn(
        `inline-block animate-spin rounded-full border-2 border-t-transparent`,
        color,
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
};

export default Spinner;
