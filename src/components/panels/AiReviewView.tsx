
"use client";
import type { FC } from 'react';
import type { ReviewCodeOutput } from "@/ai/flows/review-code";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ThumbsUp, Zap, Accessibility, Info } from 'lucide-react'; // Changed CheckCircle to ThumbsUp

interface AiReviewViewProps {
    result: ReviewCodeOutput | null;
    isLoading: boolean;
}

const AiReviewView: FC<AiReviewViewProps> = ({ result, isLoading }) => {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1,2,3].map(i => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-4 w-3/4 mt-1" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-4 w-5/6 mt-2" />
                            <Skeleton className="h-4 w-full mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!result) {
        return (
            <div className="text-center text-muted-foreground py-10 flex flex-col items-center">
                <Info className="mx-auto h-12 w-12 mb-4 text-primary" />
                <p className="text-lg font-medium">No review results yet.</p>
                <p className="text-sm">Click "Review Code" to get AI feedback on your code.</p>
            </div>
        );
    }

    const reviewItems = [
        { title: "Readability", Icon: ThumbsUp, content: result.readability, description: "Suggestions for improving code clarity and maintainability." },
        { title: "Performance", Icon: Zap, content: result.performance, description: "Tips for optimizing code speed and efficiency." },
        { title: "Accessibility", Icon: Accessibility, content: result.accessibility, description: "Recommendations for making your code more accessible." },
    ];

    return (
        <div className="space-y-4">
            {reviewItems.map(item => (
                <Card key={item.title} className="shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                            <item.Icon className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                        </div>
                        {item.description && <CardDescription className="text-xs pt-1 pl-8">{item.description}</CardDescription>}
                    </CardHeader>
                    <CardContent className="pl-8">
                        {item.content ? (
                            <pre className="whitespace-pre-wrap text-xs md:text-sm font-mono bg-muted p-3 rounded-md text-foreground leading-relaxed">
                  {item.content}
                </pre>
                        ) : (
                            <p className="text-xs md:text-sm text-muted-foreground">No specific suggestions for {item.title.toLowerCase()}.</p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default AiReviewView;
