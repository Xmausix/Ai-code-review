// src/ai/flows/review-code.ts
'use server';

/**
 * @fileOverview AI code review flow that analyzes code for readability, performance, and accessibility.
 *
 * - reviewCode - A function that handles the code review process.
 * - ReviewCodeInput - The input type for the reviewCode function.
 * - ReviewCodeOutput - The return type for the reviewCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReviewCodeInputSchema = z.object({
    code: z.string().describe('The code to be reviewed (JS/HTML/CSS).'),
    language: z.enum(['javascript', 'html', 'css']).describe('The programming language of the code.'),
});
export type ReviewCodeInput = z.infer<typeof ReviewCodeInputSchema>;

const ReviewCodeOutputSchema = z.object({
    readability: z.string().describe('Suggestions for improving code readability.'),
    performance: z.string().describe('Suggestions for improving code performance.'),
    accessibility: z.string().describe('Suggestions for improving code accessibility.'),
});
export type ReviewCodeOutput = z.infer<typeof ReviewCodeOutputSchema>;

export async function reviewCode(input: ReviewCodeInput): Promise<ReviewCodeOutput> {
    return reviewCodeFlow(input);
}

const reviewCodePrompt = ai.definePrompt({
    name: 'reviewCodePrompt',
    input: {schema: ReviewCodeInputSchema},
    output: {schema: ReviewCodeOutputSchema},
    prompt: `You are an AI code reviewer that analyzes code for readability, performance and accessibility.

  Provide suggestions for improvements related to these three aspects.

  Language: {{{language}}}
  Code: {{{code}}}`,
});

const reviewCodeFlow = ai.defineFlow(
    {
        name: 'reviewCodeFlow',
        inputSchema: ReviewCodeInputSchema,
        outputSchema: ReviewCodeOutputSchema,
    },
    async input => {
        const {output} = await reviewCodePrompt(input);
        return output!;
    }
);
