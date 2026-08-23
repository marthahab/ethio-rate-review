import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getMyBusinesses, updateBusiness } from '../lib/api'
import { getToken, getUser, isLoggedIn } from '../lib/auth'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

type MyBusiness = {
  id: number
  name: string
  description: string | null
  address: string | null
  city: string | null
  phone: string | null
  website: string | null
  googleMapsUrl: string | null
  imageUrl: string | null
  averageRating: number
  reviewCount: number
  reviews: {
    id: number
    rating: number
    comment: string | null
    createdAt: string
    user: { id: number; name: string }
  }[]
}

function DashboardPage() {
  const navigate = useNavigate()
  const [checked, setChecked] = useState(false)
  const [authorized, setAuthorized] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [businesses, setBusinesses] = useState<MyBusiness[]>([])

  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    phone: '',
    website: '',
    googleMapsUrl: '',
    imageUrl: '',
  })

  useEffect(() => {
    const user = getUser<{ id: number; role: string }>()
    if (!isLoggedIn() || !user || (user.role !== 'BUSINESS_OWNER' && user.role !== 'ADMIN')) {
      setAuthorized(false)
      setChecked(true)
      navigate({ to: '/' })
      return
    }
    setAuthorized(true)
    setChecked(true)
  }, [navigate])

  useEffect(() => {
    if (!authorized) return

    const token = getToken()
    if (!token) return

    setLoading(true)
    setError('')

    getMyBusinesses(token)
      .then((data) => setBusinesses(data))
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load your business')
      })
      .finally(() => setLoading(false))
  }, [authorized])

  function startEditing(business: MyBusiness) {
    setEditingId(business.id)
    setSaveError('')
    setForm({
      name: business.name || '',
      description: business.description || '',
      address: business.address || '',
      city: business.city || '',
      phone: business.phone || '',
      website: business.website || '',
      googleMapsUrl: business.googleMapsUrl || '',
      imageUrl: business.imageUrl || '',
    })
  }

  function cancelEditing() {
    setEditingId(null)
    setSaveError('')
  }

  async function handleSave(businessId: number) {
    setSaving(true)
    setSaveError('')
    const token = getToken()
    if (!token) return

    try {
      const updated = await updateBusiness(
        businessId,
        {
          name: form.name || undefined,
          description: form.description || undefined,
          address: form.address || undefined,
          city: form.city || undefined,
          phone: form.phone || undefined,
          website: form.website || undefined,
          googleMapsUrl: form.googleMapsUrl || undefined,
          imageUrl: form.imageUrl || undefined,
        },
        token,
      )

      setBusinesses((prev) =>
        prev.map((b) => (b.id === businessId ? { ...b, ...updated } : b)),
      )
      setEditingId(null)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (!checked || !authorized) {
    return null
  }

  return (
    <main className="min-h-screen bg-[#f7f1df] text-[#173f35]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <a href="/" className="text-sm font-semibold text-[#174d3d] hover:underline">
          Back to Site
        </a>

        <h1 className="mt-6 text-4xl font-bold">Your Business Dashboard</h1>
        <p className="mt-2 text-[#718078]">
          View and manage the business you've registered on EthioRate.
        </p>

        {loading && (
          <p className="mt-8 text-sm text-[#718078]">Loading your business...</p>
        )}

        {error && (
          <p className="mt-8 text-sm font-semibold text-red-600">{error}</p>
        )}

        {!loading && !error && businesses.length === 0 && (
          <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-[#718078]">
              You don't have a registered business yet.
            </p>
            
              <a href="/businesses/register"
              className="mt-4 inline-block rounded-xl bg-[#174d3d] px-5 py-3 font-semibold text-[#f4c84a] transition hover:bg-[#0f392d]"
            >
              Register Your Business
            </a>
          </div>
        )}

        {!loading &&
          !error &&
          businesses.map((business) => (
            <div key={business.id} className="mt-8 rounded-2xl bg-white p-6 shadow-sm lg:p-8">
              {editingId === business.id ? (
                <>
                  <h2 className="text-2xl font-bold">Edit Business</h2>

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-semibold">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-xl border border-[#dfe4d8] bg-[#fafbf8] px-4 py-3 text-sm outline-none focus:border-[#174d3d]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-semibold">
                        Description
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={4}
                        className="w-full resize-none rounded-xl border border-[#dfe4d8] bg-[#fafbf8] px-4 py-3 text-sm outline-none focus:border-[#174d3d]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold">City</label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full rounded-xl border border-[#dfe4d8] bg-[#fafbf8] px-4 py-3 text-sm outline-none focus:border-[#174d3d]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold">Address</label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full rounded-xl border border-[#dfe4d8] bg-[#fafbf8] px-4 py-3 text-sm outline-none focus:border-[#174d3d]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold">Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full rounded-xl border border-[#dfe4d8] bg-[#fafbf8] px-4 py-3 text-sm outline-none focus:border-[#174d3d]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold">Website</label>
                      <input
                        type="url"
                        value={form.website}
                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                        className="w-full rounded-xl border border-[#dfe4d8] bg-[#fafbf8] px-4 py-3 text-sm outline-none focus:border-[#174d3d]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Google Maps Link
                      </label>
                      <input
                        type="url"
                        value={form.googleMapsUrl}
                        onChange={(e) => setForm({ ...form, googleMapsUrl: e.target.value })}
                        className="w-full rounded-xl border border-[#dfe4d8] bg-[#fafbf8] px-4 py-3 text-sm outline-none focus:border-[#174d3d]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-semibold">
                        Photo URL
                      </label>
                      <input
                        type="url"
                        value={form.imageUrl}
                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                        placeholder="https://example.com/photo.jpg"
                        className="w-full rounded-xl border border-[#dfe4d8] bg-[#fafbf8] px-4 py-3 text-sm outline-none focus:border-[#174d3d]"
                      />
                    </div>
                  </div>

                  {saveError && (
                    <p className="mt-4 text-sm font-semibold text-red-600">{saveError}</p>
                  )}

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={saving}
                      className="rounded-xl px-5 py-3 font-semibold text-[#718078] transition hover:bg-[#eef1e8] disabled:opacity-60"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSave(business.id)}
                      disabled={saving}
                      className="flex-1 rounded-xl bg-[#174d3d] px-5 py-3 font-semibold text-[#f4c84a] transition hover:bg-[#0f392d] disabled:opacity-60"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {business.imageUrl && (
                    <div className="mb-6 h-48 overflow-hidden rounded-2xl bg-[#eef1e8]">
                      <img
                        src={business.imageUrl}
                        alt={business.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{business.name}</h2>
                      <p className="mt-1 text-sm text-[#718078]">
                        {business.city || 'No city set'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => startEditing(business)}
                      className="rounded-xl border border-[#dfe4d8] px-4 py-2 text-sm font-semibold text-[#174d3d] transition hover:bg-[#f7f1df]"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="mt-4 flex gap-6 text-sm text-[#718078]">
                    <span>
                      <strong className="text-[#173f35]">
                        {business.averageRating.toFixed(1)}
                      </strong>{' '}
                      average rating
                    </span>
                    <span>
                      <strong className="text-[#173f35]">
                        {business.reviewCount}
                      </strong>{' '}
                      reviews
                    </span>
                  </div>

                  {business.description && (
                    <p className="mt-4 text-sm text-[#173f35]">{business.description}</p>
                  )}

                  <div className="mt-4 grid gap-2 text-sm text-[#718078] md:grid-cols-2">
                    {business.address && <p>Address: {business.address}</p>}
                    {business.phone && <p>Phone: {business.phone}</p>}
                    {business.website && <p>Website: {business.website}</p>}
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-bold">Recent Reviews</h3>
                    {business.reviews.length === 0 && (
                      <p className="mt-2 text-sm text-[#718078]">No reviews yet.</p>
                    )}
                    <div className="mt-3 space-y-3">
                      {business.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="rounded-xl border border-[#eef1e8] p-4"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{review.user.name}</p>
                            <p className="text-sm text-[#718078]">
                              {review.rating} / 5
                            </p>
                          </div>
                          {review.comment && (
                            <p className="mt-1 text-sm text-[#173f35]">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
      </div>
    </main>
  )
}

