import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="bg-foreground/10 h-8 w-48 mb-2" />
          <Skeleton className="bg-foreground/10 h-4 w-64" />
        </div>
        <Skeleton className="bg-foreground/10 h-10 w-32" />
      </div>

      <div className="flex gap-4">
        <Skeleton className="bg-foreground/10 h-10 flex-1" />
        <Skeleton className="bg-foreground/10 h-10 w-40" />
        <Skeleton className="bg-foreground/10 h-10 w-40" />
      </div>

      <div className="rounded-md border mt-4">
        <div className="border-b p-4">
          <Skeleton className="bg-foreground/10 h-6 w-full" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b p-4">
            <Skeleton className="bg-foreground/10 h-4 w-12" />
            <Skeleton className="bg-foreground/10 h-4 flex-1" />
            <Skeleton className="bg-foreground/10 h-4 w-24" />
            <Skeleton className="bg-foreground/10 h-4 w-24" />
            <Skeleton className="bg-foreground/10 h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}