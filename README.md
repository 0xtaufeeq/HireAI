# HireAI

An AI-powered recruitment platform that streamlines the hiring process through intelligent resume parsing, candidate matching, and comprehensive analytics.

## Test Credentials

### Recruiter Side
- rec1@test.com
- rec2@test.com

### Candidate Side  
- candidate1@test.com
- candidate2@test.com

**Password for all accounts:** `testpass`

## 🚀 Features

### For Recruiters
- **AI Resume Parser**: Upload and parse resumes in PDF and DOCX formats
- **Intelligent Candidate Matching**: AI-powered job-to-candidate matching with scoring
- **Talent Pool Management**: Organize and search through candidate databases
- **Batch Analysis**: Analyze multiple resumes simultaneously for insights
- **Candidate Outreach**: Streamlined communication tools
- **Analytics Dashboard**: Comprehensive recruitment metrics and insights

### For Candidates
- **Profile Management**: Create and manage professional profiles
- **Job Matching**: Get matched with relevant opportunities
- **Application Tracking**: Track application status and progress

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Next.js API Routes, Supabase
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with JWT
- **AI/ML**: Google Generative AI (Gemini)
- **File Processing**: PDF parsing, DOCX processing
- **Analytics**: PostHog
- **Forms**: React Hook Form with Zod validation

## 📁 Project Structure

```
hire-ai/
├── app/
│   ├── (recruiter)/           # Recruiter-specific pages
│   │   ├── dashboard/         # Main recruiter dashboard
│   │   ├── resume-parser/     # Resume upload and parsing
│   │   ├── candidates/        # Candidate management
│   │   ├── talent-pool/       # Talent pool overview
│   │   ├── analytics/         # Recruitment analytics
│   │   ├── search/           # Candidate search
│   │   └── outreach/         # Communication tools
│   ├── (candidate)/          # Candidate-specific pages
│   │   └── home/             # Candidate dashboard
│   ├── api/                  # API routes
│   │   ├── candidates/       # Candidate API endpoints
│   │   └── resume-parser/    # Resume processing endpoints
│   ├── auth/                 # Authentication pages
│   ├── login/                # Login page
│   └── jobs/                 # Job listings
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── app-sidebar.tsx       # Application sidebar
│   ├── header.tsx            # Header component
│   ├── login-form.tsx        # Login form
│   └── theme-provider.tsx    # Theme management
├── lib/
│   ├── resume-parser.ts      # Core resume parsing logic
│   ├── utils.ts              # Utility functions
│   └── posthog.ts           # Analytics configuration
├── utils/
│   ├── supabase/            # Supabase client configuration
│   └── migrations/          # Database migrations
├── data/
│   └── sample-candidates.json # Sample candidate data
├── public/                  # Static assets
├── styles/                  # Global styles
└── hooks/                   # Custom React hooks
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm/pnpm/yarn package manager
- Supabase account
- Google AI API key (for Gemini)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HireAI/hire-ai
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the hire-ai directory:
   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Google AI (Gemini) Configuration
   GOOGLE_AI_API_KEY=your_google_ai_api_key

   # PostHog Analytics (Optional)
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
   NEXT_PUBLIC_POSTHOG_HOST=https://us.posthog.com

   # Next.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Setup

The application uses Supabase as the backend. Make sure to:

1. Create a new Supabase project
2. Run the migrations in `utils/migrations/`
3. Set up Row Level Security (RLS) policies
4. Configure authentication providers

## 🔧 Configuration

### PostHog Analytics Setup

To enable analytics:

1. Sign up for PostHog
2. Get your project API key
3. Add the keys to your `.env.local` file
4. Restart the development server

### Resume Parser Configuration

The AI-powered resume parser supports:
- **File formats**: PDF, DOC, DOCX
- **Maximum file size**: 10MB per file
- **Batch processing**: Multiple files simultaneously
- **Extracted data**: Contact info, skills, experience, education

## 🎯 User Roles

### Recruiter
- Access to candidate management
- Resume parsing and analysis
- Job posting and matching
- Analytics and reporting

### Candidate  
- Profile creation and management
- Job application tracking
- Skill assessment tools

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

**Taufeeq Riyaz**
**Kautilya DA**
**Pushan T**
**Sagar N Rao**

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Google AI Documentation](https://ai.google.dev/docs)
