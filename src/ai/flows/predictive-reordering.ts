'use server';

/**
 * @fileOverview This file defines a Genkit flow for predictive reordering of materials based on past inventory data.
 *
 * The flow analyzes inventory data and uses generative AI to suggest optimal reordering schedules, minimizing stockouts and reducing holding costs.
 *
 * - predictReorderingSchedule - A function that takes inventory data as input and returns a reordering schedule.
 * - PredictiveReorderingInput - The input type for the predictReorderingSchedule function.
 * - PredictiveReorderingOutput - The return type for the predictReorderingSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema definition
const PredictiveReorderingInputSchema = z.object({
  inventoryData: z.string().describe('Historical inventory data in JSON format.'),
  materials: z.array(z.string()).describe('List of materials to predict reordering schedule for'),
});
export type PredictiveReorderingInput = z.infer<typeof PredictiveReorderingInputSchema>;

// Output schema definition
const PredictiveReorderingOutputSchema = z.object({
  reorderingSchedule: z.string().describe('Suggested reordering schedule in JSON format.'),
});
export type PredictiveReorderingOutput = z.infer<typeof PredictiveReorderingOutputSchema>;

// Exported function to trigger the flow
export async function predictReorderingSchedule(input: PredictiveReorderingInput): Promise<PredictiveReorderingOutput> {
  return predictiveReorderingFlow(input);
}

// Prompt definition
const prompt = ai.definePrompt({
  name: 'predictReorderingPrompt',
  input: {schema: PredictiveReorderingInputSchema},
  output: {schema: PredictiveReorderingOutputSchema},
  prompt: `You are an inventory management expert. Analyze the provided historical inventory data and materials to generate an optimized reordering schedule.

Inventory Data: {{{inventoryData}}}
Materials: {{{materials}}}

Based on this data, suggest a reordering schedule that minimizes stockouts and reduces holding costs. Return the schedule in JSON format.`, // Ensure the model returns JSON format
});

// Flow definition
const predictiveReorderingFlow = ai.defineFlow(
  {
    name: 'predictiveReorderingFlow',
    inputSchema: PredictiveReorderingInputSchema,
    outputSchema: PredictiveReorderingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
