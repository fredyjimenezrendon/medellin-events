import { CSSProperties } from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  style?: CSSProperties;
}

export default function Skeleton({
  className = "",
  width,
  height,
  borderRadius = "0.375rem",
  style,
}: SkeletonProps) {
  const skeletonStyle: CSSProperties = {
    width,
    height,
    borderRadius,
    ...style,
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 ${className}`}
      style={skeletonStyle}
      aria-label="Loading..."
    />
  );
}
