'use server';

/**
 * @fileOverview A trending style suggestion AI agent.
 *
 * - trendingStyleSuggestions - A function that handles the style suggestion process.
 * - TrendingStyleSuggestionsInput - The input type for the trendingStyleSuggestions function.
 * - TrendingStyleSuggestionsOutput - The return type for the trendingStyleSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrendingStyleSuggestionsInputSchema = z.object({
  userPreferences: z
    .string()
    .describe('A description of the users style preferences.'),
  season: z.string().describe('The current season.'),
});
export type TrendingStyleSuggestionsInput = z.infer<typeof TrendingStyleSuggestionsInputSchema>;

const TrendingStyleSuggestionsOutputSchema = z.object({
  styleSuggestions: z.array(z.string()).describe('A list of trending style suggestions.'),
  reasoning: z.string().describe('Reasoning behind the style suggestions.'),
});
export type TrendingStyleSuggestionsOutput = z.infer<typeof TrendingStyleSuggestionsOutputSchema>;

export async function trendingStyleSuggestions(input: TrendingStyleSuggestionsInput): Promise<TrendingStyleSuggestionsOutput> {
  return trendingStyleSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'trendingStyleSuggestionsPrompt',
  input: {schema: TrendingStyleSuggestionsInputSchema},
  output: {schema: TrendingStyleSuggestionsOutputSchema},
  prompt: `You are a personal stylist who specializes in recommending trending styles to users based on their preferences and the current season.

  User Preferences: {{{userPreferences}}}
  Season: {{{season}}}

  Please provide a list of trending style suggestions and the reasoning behind them.
  `,
});

const trendingStyleSuggestionsFlow = ai.defineFlow(
  {
    name: 'trendingStyleSuggestionsFlow',
    inputSchema: TrendingStyleSuggestionsInputSchema,
    outputSchema: TrendingStyleSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
