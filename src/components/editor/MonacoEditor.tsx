
"use client";

import type { FC } from 'react';
import Editor, { type OnChange, type EditorProps } from "@monaco-editor/react";
import { Skeleton } from '@/components/ui/skeleton';

interface MonacoEditorProps {
    language: 'javascript' | 'html' | 'css';
    value: string;
    onChange: OnChange;
    theme?: EditorProps['theme'];
}

const MonacoEditorComponent: FC<MonacoEditorProps> = ({ language, value, onChange, theme = 'vs' }) => {
    const editorOptions: EditorProps['options'] = {
        minimap: { enabled: true, side: 'right' },
        fontSize: 14,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
        },
        lineNumbers: 'on',
        glyphMargin: true,
        folding: true,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 3,
        padding: { top: 10, bottom: 10 }
    };

    return (
        <div className="h-full w-full rounded-md border bg-card shadow-sm overflow-hidden">
            <Editor
                height="100%"
                language={language}
                value={value}
                onChange={onChange}
                theme={theme}
                options={editorOptions}
                loading={<Skeleton className="h-full w-full rounded-md" />}
            />
        </div>
    );
};

export default MonacoEditorComponent;
