
import { createFileRoute, useRouter } from '@tanstack/react-router'
import type { Business } from '../../lib/api'
import { createReview } from '../../lib/api'
import { getToken, isLoggedIn } from '../../lib/auth'
import { useState, useRef, useEffect } from 'react'
export const Route = createFileRoute('/businesses/$id')({
 loader: async ({ params }) => {
  const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:3001'

  const response = await fetch(
    `${API_URL}/businesses/${params.id}`,
  )

  if (!response.ok) {
    throw new Error('Business not found')
  }

  return response.json() as Promise<Business>
},
  component: BusinessDetails,
})

function BusinessDetails() {
  const business = Route.useLoaderData()
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const category =
    business.categories[0]?.category.name ?? 'Business'

useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showForm])

  function handleWriteReviewClick() {
    if (!isLoggedIn()) {
      window.location.href = '/login'
      return
    }

    setShowForm(true)
    setError('')
  }

  function handleCancelReview() {
    setShowForm(false)
    setError('')
    setComment('')
    setRating(5)
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const token = getToken()
    if (!token) {
      window.location.href = '/login'
      return
    }
    setLoading(true)

    try {
      await createReview(
        business.id,
        rating,
        comment.trim(),
        token,
      )

      // Reset form
      setComment('')
      setRating(5)
      setShowForm(false)

      // Refresh business data
      await router.invalidate()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to submit review',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5ed]">
      {/* ==================== HERO ==================== */}
      <section className="bg-[#174d3d] px-6 py-16 text-white lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#d8b43b]">
            {category}
          </p>

          <h1 className="text-4xl font-bold sm:text-5xl">
            {business.name}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-[#dce7df]">
            <span>
              ⭐ {business.averageRating.toFixed(1)}
            </span>

            <span>
              {business.reviewCount}{' '}
              {business.reviewCount === 1
                ? 'review'
                : 'reviews'}
            </span>

            {business.city && (
              <span>{business.city}</span>
            )}
          </div>
        </div>
      </section>

      {/* ==================== MAIN CONTENT ==================== */}
      <section className="px-6 py-12 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[2fr_1fr]">

          {/* ==================== LEFT COLUMN ==================== */}
          <div className="space-y-8">

            {/* Business Image */}
            <div className="flex h-72 items-center justify-center rounded-3xl bg-[#dfe8d9]">
              <span className="text-7xl">☕</span>
            </div>

            {/* About */}
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#173f35]">
                About {business.name}
              </h2>

              <p className="mt-4 leading-7 text-[#718078]">
                {business.description ||
                  'No description has been added yet.'}
              </p>
            </div>

            {/* ==================== REVIEWS ==================== */}
            <div className="rounded-3xl bg-white p-8 shadow-sm">

              {/* Review Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#173f35]">
                  Reviews
                </h2>

                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#173f35]">
                    {business.averageRating.toFixed(1)}
                  </span>

                  <span className="text-sm text-[#718078]">
                    ({business.reviewCount})
                  </span>
                </div>
              </div>

              {/* ==================== REVIEW FORM ==================== */}
              {showForm && (
                <form
                  onSubmit={handleSubmitReview}
                  className="mt-8 rounded-2xl border border-[#dfe4d8] bg-[#f7f5ed] p-6"
                >
                  <h3 className="mb-6 text-xl font-bold text-[#173f35]">
                    Write a Review
                  </h3>

                  {/* Rating */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-[#173f35]">
                      Your Rating
                    </label>

                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-4xl transition ${
                            star <= rating
                              ? 'text-[#f4c84a]'
                              : 'text-[#dfe4d8]'
                          }`}
                          aria-label={`${star} star`}
                        >
                          ★
                        </button>
                      ))}
                    </div>

                    <p className="mt-2 text-sm text-[#718078]">
                      {rating} out of 5 stars
                    </p>
                  </div>

                  {/* Comment */}
                  <div className="mt-6">
                    <label
                      htmlFor="comment"
                      className="mb-2 block text-sm font-semibold text-[#173f35]"
                    >
                      Your Review
                    </label>

                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) =>
                        setComment(e.target.value)
                      }
                      placeholder="Share your experience with this business..."
                      rows={5}
                      required
                      className="w-full resize-none rounded-xl border border-[#dfe4d8] bg-white px-4 py-3 text-sm text-[#173f35] outline-none transition focus:border-[#174d3d] focus:ring-2 focus:ring-[#174d3d]/10"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="mt-4 rounded-xl bg-red-50 px-4 py-3">
                      <p className="text-sm font-semibold text-red-600">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="mt-6 flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-xl bg-[#174d3d] px-6 py-3 font-semibold text-white transition hover:bg-[#0f392d] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading
                        ? 'Submitting...'
                        : 'Submit Review'}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelReview}
                      className="rounded-xl border border-[#dfe4d8] bg-white px-6 py-3 font-semibold text-[#718078] transition hover:bg-[#eef1e8]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* ==================== EXISTING REVIEWS ==================== */}
              <div className="mt-8 space-y-6">

                {business.reviews &&
                business.reviews.length > 0 ? (
                  business.reviews.map((review) => (
                    <article
                      key={review.id}
                      className="border-b border-[#e5e8df] pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between gap-4">

                        <div>
                          <h3 className="font-semibold text-[#173f35]">
                            {review.user.name}
                          </h3>

                          <p className="mt-1 text-xs text-[#8a958e]">
                            {new Date(
                              review.createdAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-[#173f35]">
                            {review.rating}
                          </span>

                          <span className="text-[#f4c84a]">
                            ★
                          </span>
                        </div>
                      </div>

                      <p className="mt-4 leading-7 text-[#718078]">
                        {review.comment}
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="rounded-xl bg-[#f7f5ed] p-6 text-center">
                    <p className="text-[#718078]">
                      No reviews yet. Be the first to review
                      this business!
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* ==================== RIGHT COLUMN ==================== */}
          <aside className="h-fit rounded-3xl bg-white p-8 shadow-sm">

            <h2 className="text-2xl font-bold text-[#173f35]">
              Business Information
            </h2>

            <div className="mt-6 space-y-5 text-[#718078]">

              {business.address && (
                <p>
                  {business.address}
                  {business.city
                    ? `, ${business.city}`
                    : ''}
                </p>
              )}

              {business.phone && (
                <p>{business.phone}</p>
              )}

              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-semibold text-[#174d3d] hover:underline"
                >
                  Visit Website
                </a>
              )}

              {business.googleMapsUrl && (
                <a
                  href={business.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-semibold text-[#174d3d] hover:underline"
                >
                  View on Google Maps
                </a>
              )}

            </div>

            {/* ==================== WRITE REVIEW BUTTON ==================== */}
            <button
              type="button"
              onClick={handleWriteReviewClick}
              className="mt-8 w-full rounded-xl border border-[#174d3d] bg-white px-5 py-3 font-semibold text-[#174d3d] transition hover:bg-[#eef1e8]"
            >
              {showForm
                ? 'Cancel Review'
                : 'Write a Review'}
            </button>

          </aside>
        </div>
      </section>
    </main>
  )
}

