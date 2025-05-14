
"use client";
import type { FC } from 'react';
import type { ExplainCodeOutput } from "@/ai/flows/explain-code";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, Info } from 'lucide-react';

interface LearnModeViewProps {
    result: ExplainCodeOutput | null;
    isLoading: boolean;
}

const LearnModeView: FC<LearnModeViewProps> = ({ result, isLoading }) => {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/2 mt-1" />
                </CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-20 w-full mt-2" />
                </CardContent>
            </Card>
        );
    }

    if (!result) {
        return (
            <div className="text-center text-muted-foreground py-10 flex flex-col items-center">
                <Info className="mx-auto h-12 w-12 mb-4 text-primary" />
                <p className="text-lg font-medium">No explanation available.</p>
                <p className="text-sm">Click "Explain Code" to get a line-by-line breakdown from AI.</p>
            </div>
        );
    }

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-medium">Code Explanation</CardTitle>
                </div>
                <CardDescription className="text-xs pt-1 pl-8">AI-generated explanation of your code.</CardDescription>
            </CardHeader>
            <CardContent className="pl-8">
        <pre className="whitespace-pre-wrap text-xs md:text-sm font-mono bg-muted p-4 rounded-md text-foreground leading-relaxed">
          {result.explanation}
        </pre>
            </CardContent>
        </Card>
    );
};

export default LearnModeView;
