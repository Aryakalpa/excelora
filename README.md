# Excelora - AI Excel Problem Solver

Excelora is a web application that helps users solve their Excel problems by leveraging AI. Users can describe their Excel challenge in plain language, and Excelora provides step-by-step solutions, formulas, and explanations.

## Core Features

- **Problem Input**: Users type their Excel problem into a text field.
- **AI-Powered Solutions**: Utilizes an AI model (configured via Genkit, currently set to Google AI in the base code) to generate:
    - Step-by-step guides
    - Excel formulas
    - Explanations of how the solution works
- **Clear Display**: Presents the solution in easy-to-understand collapsible sections.
- **Formula Copy**: Allows users to copy the generated Excel formula with a single click.
- **User Authentication**: Optional user sign-up/login using Supabase to save problem history.
- **History**: Logged-in users can access their previously asked questions and the generated solutions.
- **(Optional) .xlsx Download**: Download a basic Excel file containing the problem and solution. (Requires `exceljs` library).

## Tech Stack

- **Frontend**: Next.js (App Router) with React, TypeScript, and Tailwind CSS
- **Styling**: Shadcn/ui components and Tailwind CSS
- **Backend/AI Orchestration**: Genkit (as per `src/ai` directory)
- **AI Model**: The application uses the AI model configured in `src/ai/genkit.ts`. The user request specified Deepseek R1 via OpenRouter, but the provided Genkit setup uses Google AI. Modifying `src/ai` was restricted.
- **Authentication & Database**: Supabase (PostgreSQL)
- **Excel File Generation**: `exceljs` (client-side for the optional download feature)

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- A Supabase account and project
- API keys for the AI service configured in Genkit (e.g., Google AI API Key if using the default `src/ai/genkit.ts` setup)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd excelora
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
    If you intend to use the Excel download feature, ensure `exceljs` is installed:
    ```bash
    npm install exceljs
    # or
    yarn add exceljs
    ```


3.  **Set up environment variables:**
    Copy the `.env.example` file to a new file named `.env.local` (or `.env` if preferred for your deployment environment) in the root of your project:
    ```bash
    cp .env.example .env.local
    ```
    Update `.env.local` with your actual credentials:
    - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project anonymous key.
    - AI-related keys (e.g., `GOOGLE_API_KEY` if using the default Genkit setup). Refer to `.env.example` for more details based on AI configuration.

4.  **Set up Supabase Database:**
    - Go to your Supabase project dashboard.
    - Navigate to the "SQL Editor".
    - Click "New query" and run the following SQL to create the `queries` table and set up Row Level Security:

    ```sql
    -- Create the queries table
    CREATE TABLE queries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      problem TEXT NOT NULL,
      solution_guide TEXT,
      formula TEXT,
      explanation TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );

    -- Enable Row Level Security (RLS) for the table
    ALTER TABLE queries ENABLE ROW LEVEL SECURITY;

    -- Policy: Allow users to read their own queries
    CREATE POLICY "Allow users to read their own queries"
    ON queries
    FOR SELECT
    USING (auth.uid() = user_id);

    -- Policy: Allow users to insert their own queries
    CREATE POLICY "Allow users to insert their own queries"
    ON queries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

    -- Optional: If you want users to be able to update their queries
    -- CREATE POLICY "Allow users to update their own queries"
    -- ON queries
    -- FOR UPDATE
    -- USING (auth.uid() = user_id)
    -- WITH CHECK (auth.uid() = user_id);

    -- Optional: If you want users to be able to delete their queries
    -- CREATE POLICY "Allow users to delete their own queries"
    -- ON queries
    -- FOR DELETE
    -- USING (auth.uid() = user_id);
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application should now be running on `http://localhost:9002` (or your configured port).

### Genkit AI Setup
The AI functionalities are managed by Genkit flows located in `src/ai`. The current setup in `src/ai/genkit.ts` uses `@genkit-ai/googleai`. If you wish to use a different AI provider like OpenRouter with Deepseek R1 (as per the original project request), you would typically modify the Genkit plugin configuration. However, this project has a constraint not to modify files under `src/ai`. Therefore, the app will use the AI model as configured in the existing `src/ai` files. Ensure the relevant API keys (e.g., `GOOGLE_API_KEY`) are set in your `.env.local` file.

For development with Genkit, you might also run:
```bash
npm run genkit:dev
# or
npm run genkit:watch
```
This starts the Genkit development UI, typically on `http://localhost:4000`.

## Building for Production

```bash
npm run build
npm run start
```

## Project Structure

-   `src/app/`: Next.js App Router pages and layouts.
    -   `auth/`: Authentication-related pages (login, signup, callback).
    -   `history/`: Page for displaying user's query history.
    -   `excelora/actions.ts`: Server Actions for AI interaction and database operations.
-   `src/components/`: React components.
    -   `core/`: Core application components (Header, Forms, Display).
    -   `auth/`: Authentication-specific components.
    -   `ui/`: Shadcn/ui components.
-   `src/lib/`: Utility functions and libraries.
    -   `supabase/`: Supabase client setup and middleware.
-   `src/ai/`: Genkit AI flows (not to be modified as per project constraints).
-   `public/`: Static assets.

## Contributing

This project is currently set up based on specific instructions. For contributions, please adhere to the established coding guidelines and project structure.
Ensure any new features or changes align with the overall architecture and design principles.
```