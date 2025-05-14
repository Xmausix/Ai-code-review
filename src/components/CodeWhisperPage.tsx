
"use client";

import { useState, useEffect, useCallback } from "react";
import type { ExplainCodeOutput } from "@/ai/flows/explain-code";
import { explainCode } from "@/ai/flows/explain-code";
import type { ReviewCodeOutput } from "@/ai/flows/review-code";
import { reviewCode } from "@/ai/flows/review-code";
import AppHeader from "@/components/layout/AppHeader";
import MonacoEditor from "@/components/editor/MonacoEditor";
import ResultsPanel from "@/components/panels/ResultsPanel";
import { useToast } from "@/hooks/use-toast";
import type { Revision, SupportedLanguage } from "@/types";
import { useCodeHistory } from "@/hooks/useCodeHistory";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useTheme } from "next-themes";

const initialCode = `// Welcome to CodeWhisper!
// Paste your JavaScript, HTML, or CSS code here.
// Then click "Review Code" or "Explain Code".

function greet(name) {
  console.log(\`Hello, \${name}!\`);
}`;

export default function CodeWhisperPage() {
    const [code, setCode] = useState<string>(""); // Initialize empty, load from localStorage
    const [language, setLanguage] = useState<SupportedLanguage>("javascript");
    const [reviewResult, setReviewResult] = useState<ReviewCodeOutput | null>(null);
    const [explanationResult, setExplanationResult] = useState<ExplainCodeOutput | null>(null);
    const [isLoadingReview, setIsLoadingReview] = useState(false);
    const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
    const [activeResultTab, setActiveResultTab] = useState<string>("review");
    const { theme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);


    const { toast } = useToast();
    const { addRevision, revisions, clearHistory } = useCodeHistory();

    useEffect(() => {
        setIsMounted(true);
        // Load saved state from localStorage
        const savedCode = localStorage.getItem("codewhisper-code");
        const savedLang = localStorage.getItem("codewhisper-language") as SupportedLanguage;
        if (savedCode) {
            setCode(savedCode);
        } else {
            setCode(initialCode); // Set initial code if nothing in local storage
        }
        if (savedLang) setLanguage(savedLang);
    }, []);

    useEffect(() => {
        if(isMounted) { // Ensure this runs only on client and after mount
            localStorage.setItem("codewhisper-code", code);
        }
    }, [code, isMounted]);

    useEffect(() => {
        if(isMounted) {
            localStorage.setItem("codewhisper-language", language);
        }
    }, [language, isMounted]);

    const handleCodeChange = useCallback((newCode: string | undefined) => {
        setCode(newCode || "");
    }, []);

    const handleLanguageChange = useCallback((lang: SupportedLanguage) => {
        setLanguage(lang);
        // Reset results when language changes
        setReviewResult(null);
        setExplanationResult(null);
    }, []);

    const handleReviewCode = async () => {
        if (!code.trim()) {
            toast({ title: "Empty Code", description: "Please enter some code to review.", variant: "destructive" });
            return;
        }
        setIsLoadingReview(true);
        setReviewResult(null);
        setActiveResultTab("review");
        try {
            const result = await reviewCode({ code, language });
            setReviewResult(result);
            addRevision({ code, language, review: result, type: 'review' });
            toast({ title: "Review Complete", description: "Code review finished successfully." });
        } catch (error) {
            console.error("Review Error:", error);
            toast({ title: "Review Failed", description: "Could not review code. Please try again.", variant: "destructive" });
        } finally {
            setIsLoadingReview(false);
        }
    };

    const handleExplainCode = async () => {
        if (!code.trim()) {
            toast({ title: "Empty Code", description: "Please enter some code to explain.", variant: "destructive" });
            return;
        }
        setIsLoadingExplanation(true);
        setExplanationResult(null);
        setActiveResultTab("learn");
        try {
            const result = await explainCode({ code, language });
            setExplanationResult(result);
            addRevision({ code, language, explanation: result, type: 'explanation' });
            toast({ title: "Explanation Ready", description: "Code explanation generated." });
        } catch (error) {
            console.error("Explanation Error:", error);
            toast({ title: "Explanation Failed", description: "Could not explain code. Please try again.", variant: "destructive" });
        } finally {
            setIsLoadingExplanation(false);
        }
    };

    const handleLoadRevision = (revision: Revision) => {
        setCode(revision.code);
        setLanguage(revision.language);
        setReviewResult(revision.review || null);
        setExplanationResult(revision.explanation || null);
        if (revision.type === 'review' && revision.review) setActiveResultTab('review');
        if (revision.type === 'explanation' && revision.explanation) setActiveResultTab('learn');
        toast({ title: "Revision Loaded", description: `Loaded revision from ${new Date(revision.timestamp).toLocaleString()}`});
    };

    if (!isMounted) { // Prevents hydration mismatch by not rendering editor/localStorage dependent UI on server
        return null;
    }

    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            <AppHeader
                language={language}
                onLanguageChange={handleLanguageChange}
                onReviewCode={handleReviewCode}
                onExplainCode={handleExplainCode}
                isReviewLoading={isLoadingReview}
                isExplainLoading={isLoadingExplanation}
            />
            <main className="flex-grow overflow-hidden">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                    <ResizablePanel defaultSize={60} minSize={30}>
                        <div className="h-full p-1.5 pt-0">
                            <MonacoEditor
                                language={language}
                                value={code}
                                onChange={handleCodeChange}
                                theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                            />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={40} minSize={20}>
                        <ResultsPanel
                            reviewResult={reviewResult}
                            explanationResult={explanationResult}
                            isLoadingReview={isLoadingReview}
                            isLoadingExplanation={isLoadingExplanation}
                            historyRevisions={revisions}
                            onLoadRevision={handleLoadRevision}
                            onClearHistory={clearHistory}
                            activeTab={activeResultTab}
                            onTabChange={setActiveResultTab}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </main>
        </div>
    );
}
