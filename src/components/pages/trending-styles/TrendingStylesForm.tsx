'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { trendingStyleSuggestions, TrendingStyleSuggestionsInput, TrendingStyleSuggestionsOutput } from '@/ai/flows/trending-style-suggestions';
import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

const trendingStylesFormSchema = z.object({
  userPreferences: z.string().min(10, { message: 'Please describe your style preferences in at least 10 characters.' }),
  season: z.string().min(3, { message: 'Please enter the current season (e.g., Spring, Summer).' }),
});

type TrendingStylesFormValues = z.infer<typeof trendingStylesFormSchema>;

export default function TrendingStylesForm() {
  const [suggestions, setSuggestions] = useState<TrendingStyleSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TrendingStylesFormValues>({
    resolver: zodResolver(trendingStylesFormSchema),
    defaultValues: {
      userPreferences: '',
      season: '',
    },
  });

  async function onSubmit(data: TrendingStylesFormValues) {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const result = await trendingStyleSuggestions(data as TrendingStyleSuggestionsInput);
      setSuggestions(result);
    } catch (e) {
      console.error(e);
      setError('Failed to get style suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-accent" />
            AI Powered Style Advisor
          </CardTitle>
          <CardDescription>
            Tell us about your style and the current season, and our AI will suggest trending looks just for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="userPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Your Style Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I love minimalist designs, comfortable fabrics, and neutral colors. I prefer classic silhouettes with a modern twist."
                        className="min-h-[100px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Current Season</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Autumn, Winter" {...field} className="text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full md:w-auto text-base py-3 px-6" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Suggestions...
                  </>
                ) : (
                  'Get Style Suggestions'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive bg-destructive/10 shadow-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {suggestions && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Your Style Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold font-headline text-accent mb-2">Suggestions:</h3>
              <ul className="list-disc list-inside space-y-2 text-foreground/90">
                {suggestions.styleSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold font-headline text-accent mb-2">Reasoning:</h3>
              <p className="text-foreground/90 whitespace-pre-line">{suggestions.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
