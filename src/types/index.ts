
import type { ExplainCodeOutput } from "@/ai/flows/explain-code";
import type { ReviewCodeOutput } from "@/ai/flows/review-code";

export type SupportedLanguage = "javascript" | "html" | "css";

export interface Revision {
    id: string;
    timestamp: number;
    code: string;
    language: SupportedLanguage;
    review?: ReviewCodeOutput;
    explanation?: ExplainCodeOutput;
    type: 'review' | 'explanation' | 'save';
}
