import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { register } from '../lib/api'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await register(name, email, password)
      navigate({ to: '/login' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f1df] text-[#173f35]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row">
        {/* Left panel */}
        <div className="flex flex-col justify-between bg-[#174d3d] px-8 py-12 text-white lg:w-1/2 lg:px-16">
          <div>
            <a href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl text-[#f4c84a]">*</span>
              <span className="text-xl font-bold">EthioRate</span>
            </a>

            <h1 className="mt-16 text-4xl font-bold leading-tight">
              Join the community
            </h1>

            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-[#174d3d]">
                  1
                </div>
                <div>
                  <p className="font-semibold">Your Details</p>
                  <p className="text-sm text-white/70">
                    Name, email &amp; password
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-12 text-xs text-white/50">
            &copy; 2026 EthioRate &middot; Addis Ababa, Ethiopia
          </p>
        </div>

        {/* Right panel - form */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-16">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-[#173f35]">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-[#718078]">
              Already have an account?{' '}
              
              <a  href="/login"
                className="font-bold text-[#174d3d] hover:underline"
              >
                Sign in
              </a>
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#173f35]"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Selam Tadesse"
                  required
                  className="w-full rounded-xl border border-[#dfe4d8] bg-[#fafbf8] px-4 py-3 text-sm outline-none transition focus:border-[#174d3d] focus:ring-2 focus:ring-[#174d3d]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#173f35]"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="selam@example.com"
                  required
                  className="w-full rounded-xl border border-[#dfe4d8] bg-[#fafbf8] px-4 py-3 text-sm outline-none transition focus:border-[#174d3d] focus:ring-2 focus:ring-[#174d3d]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#173f35]"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-[#dfe4d8] bg-[#fafbf8] px-4 py-3 text-sm outline-none transition focus:border-[#174d3d] focus:ring-2 focus:ring-[#174d3d]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#173f35]"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-[#dfe4d8] bg-[#fafbf8] px-4 py-3 text-sm outline-none transition focus:border-[#174d3d] focus:ring-2 focus:ring-[#174d3d]/10"
                />
              </div>

              <label className="flex items-start gap-3 text-sm text-[#718078]">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  required
                  className="mt-1"
                />
                <span>
                  I agree to EthioRate&apos;s{' '}
                  <a href="/terms" className="font-semibold text-[#174d3d] hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="font-semibold text-[#174d3d] hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>

              {error && (
                <p className="text-sm font-semibold text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#174d3d] px-5 py-3 font-semibold text-[#f4c84a] transition hover:bg-[#0f392d] disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}