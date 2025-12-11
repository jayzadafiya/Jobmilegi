"use client";

import { useEffect } from "react";

interface AdSenseUnitProps {
  slot: string;
  format?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AdSenseUnit({
  slot,
  format = "auto",
  className = "",
  style = { display: "block" },
}: AdSenseUnitProps) {
  // Temporarily disabled until AdSense approval
  return (
    <div
      className={`bg-gradient-to-r from-gray-100 to-gray-200 p-6 text-center rounded-lg border-2 border-dashed border-gray-300 ${className}`}
    >
      <div className="text-gray-600">
        <svg
          className="w-8 h-8 mx-auto mb-2 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
        <p className="font-medium">Advertisement Space</p>
        <p className="text-xs text-gray-500 mt-1">Pending AdSense Approval</p>
      </div>
    </div>
  );
}
