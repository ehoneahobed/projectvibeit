import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CourseDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Course Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-4 w-48 mb-4" />
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-6 w-full mb-6" />
        
        <div className="flex items-center gap-6 mb-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-2 w-full mb-4" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      {/* Modules List Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-6 w-64 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, lessonIndex) => (
                  <div key={lessonIndex} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-5 h-5 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-48 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}