import { Skeleton } from "@/shared/components/ui/skeleton";

const OrderTrackingSkeleton = () => {
    return (
        <div className="animate-pulse space-y-6">
        <div className="hidden md:block">
            <Skeleton className="h-6 w-64 rounded" />
        </div>

        <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-3 w-32" />
            </div>
        </div>

        {[1, 2].map((i) => (
            <div
            key={i}
            className="w-full bg-[#F7F7F7] rounded-3xl p-4 flex items-center gap-4"
            >
            <Skeleton className="w-20 h-20 md:w-36 md:h-36 rounded-xl" />
            <div className="flex-1 space-y-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-8 w-20 rounded" />
            </div>
        ))}

        <div className="bg-[#F7F7F7] rounded-lg p-6 space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-80" />
            <Skeleton className="h-3 w-52" />
        </div>

        <div className="bg-[#F7F7F7] rounded-lg p-6 space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
        </div>
        </div>
    );
};

export default OrderTrackingSkeleton;
