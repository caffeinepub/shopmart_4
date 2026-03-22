import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-8 w-full rounded-full" />
      </div>
    </div>
  );
}
