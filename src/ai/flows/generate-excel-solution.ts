
// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Excel problem solver AI agent.
 *
 * - generateExcelSolution - A function that handles the generation of Excel solutions.
 * - GenerateExcelSolutionInput - The input type for the generateExcelSolution function.
 * - GenerateExcelSolutionOutput - The return type for the generateExcelSolution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExcelSolutionInputSchema = z.object({
  problem: z.string().describe('The Excel problem described in plain language.'),
});
export type GenerateExcelSolutionInput = z.infer<typeof GenerateExcelSolutionInputSchema>;

const GenerateExcelSolutionOutputSchema = z.object({
  stepByStepGuide: z.string().describe('The step-by-step guide to solve the Excel problem, formatted as clean, semantic HTML. Use appropriate tags like <p>, <ul>, <li>, <strong>, <code>, etc. for structure and emphasis. Ensure the HTML is self-contained and ready for direct rendering.'),
  formula: z.string().describe('The required Excel formula to solve the problem. This should be plain text, not HTML.'),
  explanation: z.string().describe('The explanation of how the formula works, formatted as clean, semantic HTML. Use appropriate tags like <p>, <ul>, <li>, <strong>, <code>, etc. for structure and emphasis. Ensure the HTML is self-contained and ready for direct rendering.'),
});
export type GenerateExcelSolutionOutput = z.infer<typeof GenerateExcelSolutionOutputSchema>;

export async function generateExcelSolution(input: GenerateExcelSolutionInput): Promise<GenerateExcelSolutionOutput> {
  return generateExcelSolutionFlow(input);
}

const generateExcelSolutionPrompt = ai.definePrompt({
  name: 'generateExcelSolutionPrompt',
  input: {schema: GenerateExcelSolutionInputSchema},
  output: {schema: GenerateExcelSolutionOutputSchema},
  prompt: `You are an Excel expert. A user has submitted the following problem.
Return:
1. A clear step-by-step guide to solve this problem using Microsoft Excel. This guide MUST be formatted as clean, semantic HTML (e.g., using <p>, <ul>, <li>, <strong> tags).
2. The required Excel formula (as plain text).
3. A plain-language explanation of how the formula and solution work. This explanation MUST be formatted as clean, semantic HTML (e.g., using <p>, <ul>, <li>, <strong> tags).

Problem: {{{problem}}}`,
});

const generateExcelSolutionFlow = ai.defineFlow(
  {
    name: 'generateExcelSolutionFlow',
    inputSchema: GenerateExcelSolutionInputSchema,
    outputSchema: GenerateExcelSolutionOutputSchema,
  },
  async input => {
    const {output} = await generateExcelSolutionPrompt(input);
    return output!;
  }
);

