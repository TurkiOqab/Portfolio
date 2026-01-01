# Dfolio

A modern portfolio builder for developers. Create a professional portfolio in minutes by uploading your CV.

Live at [dfolio.dev](https://dfolio.dev)

## Features

- **AI-Powered CV Import** - Upload your resume and let AI extract your information automatically
- **Beautiful Themes** - Multiple color themes to match your personal brand
- **Custom Fonts** - Choose from a variety of professional fonts
- **Responsive Design** - Looks great on desktop and mobile
- **Portfolio Sections** - Showcase your education, experience, projects, and skills
- **Custom URL** - Get your own dfolio.dev/username link

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **AI**: OpenAI GPT-4 for CV parsing
- **Email**: Resend
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key
- Resend API key

### Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
RESEND_API_KEY=your_resend_api_key
```

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
app/
  [username]/      # Public portfolio pages
  api/             # API routes
  components/      # Reusable components
  dashboard/       # User dashboard
  lib/             # Utilities and configs
  onboarding/      # Onboarding flow
  login/           # Authentication
  signup/
```

## License

MIT
