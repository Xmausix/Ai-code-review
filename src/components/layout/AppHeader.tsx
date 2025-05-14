
"use client";
import type { FC } from 'react';
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SupportedLanguage } from "@/types";
import { Code, Lightbulb, Play, Loader2, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

interface AppHeaderProps {
    language: SupportedLanguage;
    onLanguageChange: (language: SupportedLanguage) => void;
    onReviewCode: () => void;
    onExplainCode: () => void;
    isReviewLoading: boolean;
    isExplainLoading: boolean;
}

const AppHeader: FC<AppHeaderProps> = ({
                                           language,
                                           onLanguageChange,
                                           onReviewCode,
                                           onExplainCode,
                                           isReviewLoading,
                                           isExplainLoading,
                                       }) => {
    const { theme, setTheme } = useTheme();

    return (
        <header className="flex items-center justify-between p-3 md:p-4 border-b bg-card shadow-sm h-16 shrink-0">
            <div className="flex items-center gap-2">
                <Code className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                <h1 className="text-lg md:text-xl font-semibold tracking-tight text-foreground">CodeWhisper</h1>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
                <Select value={language} onValueChange={(value) => onLanguageChange(value as SupportedLanguage)}>
                    <SelectTrigger className="w-[120px] md:w-[150px] text-xs md:text-sm">
                        <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="css">CSS</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" onClick={onReviewCode} disabled={isReviewLoading || isExplainLoading} className="text-xs md:text-sm px-2 md:px-3">
                    {isReviewLoading ? <Loader2 className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" /> : <Play className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />}
                    <span className="hidden sm:inline">Review</span>
                </Button>
                <Button variant="outline" onClick={onExplainCode} disabled={isReviewLoading || isExplainLoading} className="text-xs md:text-sm px-2 md:px-3">
                    {isExplainLoading ? <Loader2 className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" /> : <Lightbulb className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />}
                    <span className="hidden sm:inline">Explain</span>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "light" || theme === "system" ? "dark" : "light")} // Ensure correct toggle from system
                    aria-label="Toggle theme"
                    className="h-8 w-8 md:h-9 md:w-9"
                >
                    <Sun className="h-4 w-4 md:h-5 md:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 md:h-5 md:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
            </div>
        </header>
    );
};

export default AppHeader;
