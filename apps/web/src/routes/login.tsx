import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { login } from '../lib/api'
import { saveAuth } from '../lib/auth'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(email, password)
      saveAuth(result.accessToken, result.user)
      navigate({ to: '/' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f1df] px-6 py-12 text-[#173f35]">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md flex-col justify-center">
        <div className="mb-8 text-center">
          <a href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#174d3d] text-xl text-[#f4c84a]">
              *
            </div>
            <span className="text-2xl font-bold">
              Ethio<span className="text-[#174d3d]">Rate</span>
            </span>
          </a>
          <h1 className="mt-8 text-3xl font-bold text-[#173f35]">
            Welcome back
          </h1>
          <p className="mt-2 text-[#718078]">
            Sign in to your EthioRate account
          </p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#173f35]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-[#dfe4d8] px-4 py-3 outline-none transition focus:border-[#174d3d]"
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
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-[#dfe4d8] px-4 py-3 outline-none transition focus:border-[#174d3d]"
              />
            </div>

            {error && (
              <p className="text-sm font-semibold text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#174d3d] px-5 py-3 font-semibold text-white transition hover:bg-[#0f392d] disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[#718078]">
            Don't have an account?{' '}
            
             <a href="/welcome"
              className="font-semibold text-[#174d3d] hover:underline"
            >
              Join Free
            </a>
          </p>
        </div>
        
         <a href="/"
          className="mt-6 text-center text-sm font-semibold text-[#174d3d] hover:underline"
        >
          &lt;- Back to home
        </a>
      </div>
    </main>
  )
}