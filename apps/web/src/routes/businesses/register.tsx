import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { register, login, createBusiness } from '../../lib/api'
import { saveAuth } from '../../lib/auth'

export const Route = createFileRoute('/businesses/register')({
  component: BusinessRegisterPage,
})

const CATEGORIES = [
  'Coffee',
  'Restaurants',
  'Hotels',
  'Shopping',
  'Beauty',
  'Services',
]

const CITIES = [
  'Addis Ababa',
  'Adama',
  'Bahir Dar',
  'Mekelle',
  'Hawassa',
  'Dire Dawa',
  'Gondar',
]

function BusinessRegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [ownerName, setOwnerName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [businessName, setBusinessName] = useState('')
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [businessPhone, setBusinessPhone] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  function goToStep2(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setStep(2)
  }

  function goToStep3(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!businessName.trim()) {
      setError('Business name is required')
      return
    }

    setStep(3)
  }

  async function handleFinalSubmit() {
    setError('')
    setLoading(true)

    try {
      await register(ownerName, email, password, 'BUSINESS_OWNER')

      const loginResult = await login(email, password)
      saveAuth(loginResult.accessToken, loginResult.user)

            const business = await createBusiness(
        {
          name: businessName,
          description: category
            ? `${category} business in ${city || 'Ethiopia'}`
            : undefined,
          address: address || undefined,
          city: city || undefined,
          phone: businessPhone || undefined,
          imageUrl: imageUrl || undefined,
          category: category || undefined,
        },
        loginResult.accessToken,
      )

      navigate({ to: '/businesses/$id', params: { id: String(business.id) } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, label: 'Your Details' },
    { number: 2, label: 'Business Info' },
    { number: 3, label: 'Review & Confirm' },
  ]

  return (
    <main className="min-h-screen bg-[#f7f1df] text-[#173f35]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row">

        <div className="flex flex-col justify-between bg-[#174d3d] px-8 py-12 text-white lg:w-1/2 lg:px-16">
          <div>
            <a href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl text-[#f4c84a]">*</span>
              <span className="text-xl font-bold">EthioRate</span>
            </a>

            <h1 className="mt-16 text-4xl font-bold leading-tight">
              List your business
            </h1>
            <p className="mt-4 text-white/70">
              Reach thousands of customers across Ethiopia.
            </p>

            <div className="mt-10 space-y-6">
              {steps.map((s) => (
                <div key={s.number} className="flex items-start gap-4">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      step === s.number
                        ? 'bg-[#f4c84a] text-[#174d3d]'
                        : step > s.number
                          ? 'bg-white text-[#174d3d]'
                          : 'bg-white/20 text-white'
                    }`}
                  >
                    {step > s.number ? 'OK' : s.number}
                  </div>
                  <div>
                    <p className="font-semibold">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-12 text-xs text-white/50">
            &copy; 2026 EthioRate &middot; Addis Ababa, Ethiopia
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-16">
          <div className="w-full max-w-md">

            {step === 1 && (
              <>
                <h2 className="text-3xl font-bold text-[#173f35]">
                  Your account details
                </h2>
                <p className="mt-2 text-sm text-[#718078]">
                  Step 1 of 3 &middot; Create your Business Owner account
                </p>

                <form className="mt-8 space-y-5" onSubmit={goToStep2}>
                  <div>
                    <label
                      htmlFor="ownerName"
                      className="mb-2 block text-sm font-semibold text-[#173f35]"
                    >
                      Full Name
                    </label>
                    <input
                      id="ownerName"
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
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
                      htmlFor="phone"
                      className="mb-2 block text-sm font-semibold text-[#173f35]"
                    >
                      Phone Number (optional)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+251 9XX XXX XXX"
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

                  {error && (
                    <p className="text-sm font-semibold text-red-600">{error}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#174d3d] px-5 py-3 font-semibold text-[#f4c84a] transition hover:bg-[#0f392d]"
                  >
                    Continue
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-[#718078]">
                  Already have an account?{' '}
                  <a href="/login" className="font-semibold text-[#174d3d] hover:underline">
                    Sign in
                  </a>
                </p>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-3xl font-bold text-[#173f35]">
                  Business info
                </h2>
                <p className="mt-2 text-sm text-[#718078]">
                  Step 2 of 3 &middot; Tell us about your business
                </p>

                <form className="mt-8 space-y-5" onSubmit={goToStep3}>
                  <div>
                    <label
                      htmlFor="businessName"
                      className="mb-2 block text-sm font-semibold text-[#173f35]"
                    >
                      Business Name
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Tomoca Coffee"
                      required
                      className="w-full rounded-xl border border-[#dfe4d8] bg-[#fafbf8] px-4 py-3 text-sm outline-none transition focus:border-[#174d3d] focus:ring-2 focus:ring-[#174d3d]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="mb-2 block text-sm font-semibold text-[#173f35]"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-[#dfe4d8] bg-[#fafbf8] px-4 py-3 text-sm outline-none transition focus:border-[#174d3d] focus:ring-2 focus:ring-[#174d3d]/10"
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-semibold text-[#173f35]"
                    >
                      Location
                    </label>
                    <select
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-xl border border-[#dfe4d8] bg-[#fafbf8] px-4 py-3 text-sm outline-none transition focus:border-[#174d3d] focus:ring-2 focus:ring-[#174d3d]/10"
                    >
                      <option value="">Select a city</option>
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="mb-2 block text-sm font-semibold text-[#173f35]"
                    >
                      Business Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Bole Road, near Edna Mall"
                      className="w-full rounded-xl border border-[#dfe4d8] bg-[#fafbf8] px-4 py-3 text-sm outline-none transition focus:border-[#174d3d] focus:ring-2 focus:ring-[#174d3d]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="businessPhone"
                      className="mb-2 block text-sm font-semibold text-[#173f35]"
                    >
                      Business Phone
                    </label>
                    <input
                      id="businessPhone"
                      type="tel"
                      value={businessPhone}
                      onChange={(e) => setBusinessPhone(e.target.value)}
                      placeholder="+251 9XX XXX XXX"
                      className="w-full rounded-xl border border-[#dfe4d8] bg-[#fafbf8] px-4 py-3 text-sm outline-none transition focus:border-[#174d3d] focus:ring-2 focus:ring-[#174d3d]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="imageUrl"
                      className="mb-2 block text-sm font-semibold text-[#173f35]"
                    >
                      Photo URL (optional)
                    </label>
                    <input
                      id="imageUrl"
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full rounded-xl border border-[#dfe4d8] bg-[#fafbf8] px-4 py-3 text-sm outline-none transition focus:border-[#174d3d] focus:ring-2 focus:ring-[#174d3d]/10"
                    />
                  </div>

                  {error && (
                    <p className="text-sm font-semibold text-red-600">{error}</p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="rounded-xl px-5 py-3 font-semibold text-[#718078] transition hover:bg-[#eef1e8]"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-[#174d3d] px-5 py-3 font-semibold text-[#f4c84a] transition hover:bg-[#0f392d]"
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-3xl font-bold text-[#173f35]">
                  Review &amp; confirm
                </h2>
                <p className="mt-2 text-sm text-[#718078]">
                  Step 3 of 3 &middot; Check your details before submitting
                </p>

                <div className="mt-8 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#eef1e8] pb-3">
                    <span className="text-sm text-[#718078]">Account Type</span>
                    <span className="rounded-full bg-[#174d3d] px-3 py-1 text-xs font-semibold text-[#f4c84a]">
                      Business Owner
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#718078]">Name</span>
                    <span className="text-sm font-semibold text-[#173f35]">{ownerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#718078]">Email</span>
                    <span className="text-sm font-semibold text-[#173f35]">{email}</span>
                  </div>
                  {phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#718078]">Phone</span>
                      <span className="text-sm font-semibold text-[#173f35]">{phone}</span>
                    </div>
                  )}

                  <div className="border-t border-[#eef1e8] pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#718078]">Business Name</span>
                      <span className="text-sm font-semibold text-[#173f35]">{businessName}</span>
                    </div>
                  </div>
                  {category && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#718078]">Category</span>
                      <span className="text-sm font-semibold text-[#173f35]">{category}</span>
                    </div>
                  )}
                  {city && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#718078]">Location</span>
                      <span className="text-sm font-semibold text-[#173f35]">{city}</span>
                    </div>
                  )}
                  {address && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#718078]">Address</span>
                      <span className="text-sm font-semibold text-[#173f35]">{address}</span>
                    </div>
                  )}
                  {businessPhone && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#718078]">Business Phone</span>
                      <span className="text-sm font-semibold text-[#173f35]">{businessPhone}</span>
                    </div>
                  )}
                  {imageUrl && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#718078]">Photo URL</span>
                      <span className="max-w-[220px] truncate text-sm font-semibold text-[#173f35]">{imageUrl}</span>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={loading}
                    className="rounded-xl px-5 py-3 font-semibold text-[#718078] transition hover:bg-[#eef1e8] disabled:opacity-60"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={loading}
                    className="flex-1 rounded-xl bg-[#174d3d] px-5 py-3 font-semibold text-[#f4c84a] transition hover:bg-[#0f392d] disabled:opacity-60"
                  >
                    {loading ? 'Registering...' : 'Register Business'}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </main>
  )
}