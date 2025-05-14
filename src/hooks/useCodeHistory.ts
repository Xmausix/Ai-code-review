
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Revision, SupportedLanguage } from '@/types';
import type { ExplainCodeOutput } from "@/ai/flows/explain-code";
import type { ReviewCodeOutput } from "@/ai/flows/review-code";

const HISTORY_STORAGE_KEY = 'codewhisper-history';
const MAX_HISTORY_ITEMS = 50;

interface AddRevisionPayload {
    code: string;
    language: SupportedLanguage;
    review?: ReviewCodeOutput;
    explanation?: ExplainCodeOutput;
    type: 'review' | 'explanation' | 'save';
}

export function useCodeHistory() {
    const [revisions, setRevisions] = useState<Revision[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);


    useEffect(() => {
        if (typeof window !== 'undefined') { // Ensure localStorage is accessed only on client
            try {
                const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
                if (storedHistory) {
                    setRevisions(JSON.parse(storedHistory));
                }
            } catch (error) {
                console.error("Failed to load history from localStorage:", error);
                setRevisions([]);
            } finally {
                setIsLoaded(true);
            }
        }
    }, []);

    const saveRevisionsToStorage = useCallback((updatedRevisions: Revision[]) => {
        if (typeof window !== 'undefined' && isLoaded) { // Ensure saving only on client and after initial load
            try {
                localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedRevisions));
            } catch (error) {
                console.error("Failed to save history to localStorage:", error);
            }
        }
    }, [isLoaded]);

    const addRevision = useCallback((payload: AddRevisionPayload) => {
        const newRevision: Revision = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            ...payload,
        };
        setRevisions(prevRevisions => {
            const updatedRevisions = [newRevision, ...prevRevisions].slice(0, MAX_HISTORY_ITEMS);
            saveRevisionsToStorage(updatedRevisions);
            return updatedRevisions;
        });
    }, [saveRevisionsToStorage]);


    const clearHistory = useCallback(() => {
        setRevisions([]);
        saveRevisionsToStorage([]);
    }, [saveRevisionsToStorage]);

    return {
        revisions,
        addRevision,
        clearHistory,
        isHistoryLoaded: isLoaded,
    };
}
