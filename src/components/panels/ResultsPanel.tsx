
"use client";
import type { FC } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AiReviewView from "./AiReviewView";
import LearnModeView from "./LearnModeView";
import HistoryView from "./HistoryView";
import type { ExplainCodeOutput } from "@/ai/flows/explain-code";
import type { ReviewCodeOutput } from "@/ai/flows/review-code";
import type { Revision } from "@/types";
import { ScrollArea } from '@/components/ui/scroll-area';

interface ResultsPanelProps {
    reviewResult: ReviewCodeOutput | null;
    explanationResult: ExplainCodeOutput | null;
    isLoadingReview: boolean;
    isLoadingExplanation: boolean;
    historyRevisions: Revision[];
    onLoadRevision: (revision: Revision) => void;
    onClearHistory: () => void;
    activeTab: string;
    onTabChange: (tabValue: string) => void;
}

const ResultsPanel: FC<ResultsPanelProps> = ({
                                                 reviewResult,
                                                 explanationResult,
                                                 isLoadingReview,
                                                 isLoadingExplanation,
                                                 historyRevisions,
                                                 onLoadRevision,
                                                 onClearHistory,
                                                 activeTab,
                                                 onTabChange,
                                             }) => {
    return (
        <div className="h-full flex flex-col p-1.5 pl-0">
            <div className="h-full flex flex-col bg-card rounded-md border shadow-sm overflow-hidden">
                <Tabs value={activeTab} onValueChange={onTabChange} className="flex-grow flex flex-col p-3">
                    <TabsList className="grid w-full grid-cols-3 mb-3 shrink-0">
                        <TabsTrigger value="review">AI Review</TabsTrigger>
                        <TabsTrigger value="learn">Learn Mode</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>
                    {/* Corrected className for ScrollArea to enable proper scrolling */}
                    <ScrollArea className="flex-grow">
                        <TabsContent value="review" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <AiReviewView result={reviewResult} isLoading={isLoadingReview} />
                        </TabsContent>
                        <TabsContent value="learn" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <LearnModeView result={explanationResult} isLoading={isLoadingExplanation} />
                        </TabsContent>
                        <TabsContent value="history" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <HistoryView
                                revisions={historyRevisions}
                                onLoadRevision={onLoadRevision}
                                onClearHistory={onClearHistory}
                            />
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </div>
        </div>
    );
};

export default ResultsPanel;
