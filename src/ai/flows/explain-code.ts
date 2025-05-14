// src/ai/flows/explain-code.ts
'use server';

/**
 * @fileOverview Explains a given code snippet line by line.
 *
 * - explainCode - A function that explains the code.
 * - ExplainCodeInput - The input type for the explainCode function.
 * - ExplainCodeOutput - The return type for the explainCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainCodeInputSchema = z.object({
    code: z.string().describe('The code to explain.'),
    language: z.string().describe('The language of the code.'),
});
export type ExplainCodeInput = z.infer<typeof ExplainCodeInputSchema>;

const ExplainCodeOutputSchema = z.object({
    explanation: z.string().describe('The explanation of the code, line by line, emphasizing key concepts with code blocks in markdown.'),
});
export type ExplainCodeOutput = z.infer<typeof ExplainCodeOutputSchema>;

export async function explainCode(input: ExplainCodeInput): Promise<ExplainCodeOutput> {
    return explainCodeFlow(input);
}

const prompt = ai.definePrompt({
    name: 'explainCodePrompt',
    input: {schema: ExplainCodeInputSchema},
    output: {schema: ExplainCodeOutputSchema},
    prompt: `You are an expert software developer. Please explain the following code line by line, emphasizing key concepts with code blocks in markdown. Only include code blocks when it is necessary to explain a concept. The explanation should be easy to understand for someone who is new to the language.

Language: {{{language}}}
Code:
{{{code}}}`,
});

const explainCodeFlow = ai.defineFlow(
    {
        name: 'explainCodeFlow',
        inputSchema: ExplainCodeInputSchema,
        outputSchema: ExplainCodeOutputSchema,
    },
    async input => {
        const {output} = await prompt(input);
        return output!;
    }
);
