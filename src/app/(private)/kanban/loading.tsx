import { Skeleton } from "@/components/ui/skeleton";

export default function KanbanLoading() {
  const loadingColumns = [1, 2, 3];
  const loadingCards = [1, 2, 3, 4];

  return (
    <div className="flex flex-col h-full">
      <header className="mb-5 mr-5 flex shrink-0 justify-end">
        <Skeleton className="h-10 w-32 rounded-md" />
      </header>

      <div className="bg-background mx-8 flex h-full min-h-[calc(100vh-195px)] snap-x snap-mandatory 
      items-stretch overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:grid-rows-1 lg:gap-3">
        {loadingColumns.map((col) => (
          <div key={col} className="h-full w-full shrink-0 snap-center px-4 lg:w-auto lg:px-0">
            <div className="flex flex-col gap-3 rounded-2xl bg-muted/10 p-3 h-full">
              <div className="flex items-center justify-between px-1 pb-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-6 rounded-full" />
              </div>

              <div className="flex flex-col gap-3">
                {loadingCards.map((card) => (
                  <Skeleton key={card} className="h-32.5 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}