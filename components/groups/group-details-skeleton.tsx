import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GroupDetailsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex justify-end pt-4">
              <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
