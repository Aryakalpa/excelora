# **App Name**: Excelora

## Core Features:

- Problem Input: Text Input: Users can input their Excel problem via a text field.
- AI Solution: AI Solution Generation: Generates a step-by-step Excel solution, formula, and explanation using Deepseek R1 via OpenRouter. An OpenAI-compatible tool uses reasoning to choose which Excel details to focus on.
- Solution Display: Solution Display: Displays the generated solution, formula, and explanation in a clear, collapsible format.
- Formula Copy: Formula Copy: Provides a button to copy the Excel formula directly to the clipboard.
- File Download: File Download (Optional): Generates and allows the download of a sample .xlsx file with the solution applied.
- User Authentication: User Authentication: Implements user authentication using Supabase for saving question history.
- History Saving: History Saving: Signed-in users can save their questions and the corresponding solutions to their user history (saved to Supabase).

## Style Guidelines:

- Primary color: Sky blue (#87CEEB), evoking clarity and a sense of helpfulness for the app's core function.
- Background color: Light gray (#F0F8FF), providing a clean, neutral backdrop to improve readability and focus.
- Accent color: Light green (#90EE90), visually distinguishing copy-paste button, reflecting the correct solutions for Excel tasks, and creating good contrast.
- Body and headline font: 'Inter' sans-serif. Choosing a clear, simple font enhances usability when applying spreadsheet logic.
- Use clear, minimalist icons to represent actions and file types.
- Use a clean, modular layout with clear section headings for problem input, solution steps, formula, and file download.
- Subtle transitions for expanding and collapsing sections.