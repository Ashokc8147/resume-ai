import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  FileText,
  Sparkles,
  Wand2,
  Zap,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'

const features = [
  {
    icon: BarChart3,
    title: 'ATS Score Analysis',
    description: 'Get an instant ATS compatibility score with actionable feedback.',
  },
  {
    icon: Wand2,
    title: 'AI Resume Rewrite',
    description: 'Improve wording, structure, and impact with Google Gemini AI.',
  },
  {
    icon: Zap,
    title: 'Fast & Simple',
    description: 'Upload a PDF and get results in seconds. No complex setup.',
  },
]

const steps = [
  'Upload your resume PDF',
  'Run ATS analysis (1 credit)',
  'Get AI-powered improvements (1 credit)',
]

export const LandingPage = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <div className="min-h-full bg-white">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
              R
            </div>
            <span className="text-lg font-semibold text-slate-900">ResumeAI</span>
          </div>
          <nav className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button>
                    Get started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Powered by Google Gemini AI
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Optimize your resume for{' '}
            <span className="text-primary">ATS systems</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            ResumeAI analyzes your resume against Applicant Tracking Systems and uses AI to
            rewrite it for maximum impact. Start free with 5 credits.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to={isAuthenticated ? '/dashboard' : '/register'}>
              <Button size="lg">
                Start for free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-slate-900">
            Everything you need to stand out
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
              <ul className="mt-8 space-y-4">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {i + 1}
                    </div>
                    <span className="text-lg text-slate-700">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-semibold text-slate-900">Free plan includes</span>
              </div>
              <ul className="mt-4 space-y-3">
                {['5 free AI credits', 'PDF upload & parsing', 'ATS score & feedback', 'AI resume rewrite'].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
              <Link to="/register" className="mt-6 block">
                <Button className="w-full">Create free account</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} ResumeAI. Built with React, Express, MongoDB & Gemini AI.
        </div>
      </footer>
    </div>
  )
}
