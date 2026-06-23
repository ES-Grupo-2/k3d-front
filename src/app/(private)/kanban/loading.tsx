export default function KanbanLoading(){
    return (
      <div className="flex h-full min-h-[calc(100vh-160px)] gap-4 px-8 overflow-hidden">
        {[1, 2, 3].map((col) => (
          <div key={col} className="w-full shrink-0 lg:w-1/3 flex flex-col gap-3">
            <p>Skeleton UI placeholder</p>
            {/* <Skeleton className="h-12 w-full rounded-sm" /> HEADER COLUMN NAME */}
            {/* <Skeleton className="h-24 w-full rounded-md" /> Card 1 */}
            {/* <Skeleton className="h-24 w-full rounded-md" /> Card 2 */}
            {/* <Skeleton className="h-24 w-full rounded-md opacity-50" /> Card 3 */}
          </div>
        ))}
      </div>
    );
}
