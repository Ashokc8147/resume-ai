import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => (
  <div className="flex min-h-full">
    <div className="hidden w-1/2 bg-gradient-to-br from-primary to-blue-800 lg:flex lg:flex-col lg:justify-between lg:p-12">
      <Link to="/" className="flex items-center gap-2 text-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg font-bold">
          R
        </div>
        <span className="text-xl font-semibold">ResumeAI</span>
      </Link>
      <div>
        <h2 className="text-3xl font-bold leading-tight text-white">
          Land your dream job with an AI-optimized resume
        </h2>
        <p className="mt-4 text-lg text-blue-100">
          Upload your resume, get ATS scores, and receive AI-powered improvements in seconds.
        </p>
      </div>
      <p className="text-sm text-blue-200">Trusted by job seekers worldwide</p>
    </div>

    <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
      <div className="mx-auto w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
            R
          </div>
          <span className="text-lg font-semibold text-slate-900">ResumeAI</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-600">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  </div>
)
