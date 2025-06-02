
'use server';

import { generateExcelSolution, type GenerateExcelSolutionInput, type GenerateExcelSolutionOutput } from '@/ai/flows/generate-excel-solution';
import { createSupabaseServerActionClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

interface ActionResult {
  solution?: GenerateExcelSolutionOutput;
  error?: string;
  queryId?: string;
}

export async function handleSubmitProblem(problem: string): Promise<ActionResult> {
  const supabase = createSupabaseServerActionClient();
  const { data: { user } } = await supabase.auth.getUser();

  try {
    const input: GenerateExcelSolutionInput = { problem };
    const solution = await generateExcelSolution(input);

    if (user) {
      const { data: queryData, error: dbError } = await supabase
        .from('queries')
        .insert({
          user_id: user.id,
          problem: problem,
          solution_guide: solution.stepByStepGuide,
          formula: solution.formula,
          explanation: solution.explanation,
        })
        .select('id')
        .single();

      if (dbError) {
        console.error('Supabase error saving query:', dbError);
        // Proceed with returning solution even if DB save fails for logged in user, but log it.
        // Don't block user from getting solution.
      } else if (queryData) {
         revalidatePath('/history'); // Revalidate history page
         return { solution, queryId: queryData.id };
      }
    }
    
    return { solution };

  } catch (error: any) {
    console.error('Error generating Excel solution:', error);
    let errorMessage = 'Failed to generate solution.';
    if (error.message) {
      errorMessage += ` Details: ${error.message}`;
    }
    return { error: errorMessage };
  }
}

export async function fetchUserHistory() {
  const supabase = createSupabaseServerActionClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'User not authenticated. Please log in to view your history.' };
  }

  const { data, error } = await supabase
    .from('queries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching history:', error);
    return { error: `Could not load your history. ${error.message ? `Details: ${error.message}` : 'Please try again later.'}` };
  }
  return { history: data as Array<GenerateExcelSolutionOutput & {id: string, problem: string, created_at: string}> };
}

interface ForgotPasswordResult {
  error?: string;
}

export async function handleForgotPasswordRequest(email: string): Promise<ForgotPasswordResult> {
  const supabase = createSupabaseServerActionClient();
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
  const redirectTo = `${siteUrl}/auth/update-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo,
  });

  if (error) {
    console.error('Error sending password reset email:', error);
    if (error.message.includes('Unable to verify CAPTCHA')) {
         return { error: 'CAPTCHA verification failed. Please try again.' };
    }
    return { error: 'There was an issue processing your request.' }; 
  }

  return {}; // Success, no error
}

interface FeedbackSubmissionResult {
  success?: boolean;
  error?: string;
}

export async function handleFeedbackSubmission(feedbackText: string): Promise<FeedbackSubmissionResult> {
  if (!feedbackText || feedbackText.trim().length === 0) {
    return { error: 'Feedback cannot be empty.' };
  }

  try {
    // In a real scenario, you might send this to a database, an email service, or a dedicated feedback tool.
    // For this example, we're logging it to the server console.
    // IMPORTANT: The specified email thearyakalpa@gmail.com is NOT used here to prevent exposure.
    // The feedback will be available in your server logs.
    console.log(`---------- USER FEEDBACK RECEIVED ----------`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Feedback: ${feedbackText}`);
    console.log(`------------------------------------------`);
    
    // Simulate a small delay for a more realistic UX
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true };
  } catch (error: any) {
    console.error('Error processing feedback submission:', error);
    return { error: 'Failed to submit feedback. Please try again later.' };
  }
}

interface ClearHistoryResult {
  success: boolean;
  error?: string;
}

export async function clearUserHistory(): Promise<ClearHistoryResult> {
  const supabase = createSupabaseServerActionClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('Error authenticating user for history deletion:', authError);
    return { success: false, error: 'Authentication failed. Please log in again.' };
  }

  const { error: deleteError } = await supabase
    .from('queries')
    .delete()
    .eq('user_id', user.id);

  if (deleteError) {
    console.error('Supabase error deleting history:', deleteError);
    return { success: false, error: `Failed to clear history. ${deleteError.message ? `Details: ${deleteError.message}` : 'Please try again.'}` };
  }

  revalidatePath('/history');
  return { success: true };
}
