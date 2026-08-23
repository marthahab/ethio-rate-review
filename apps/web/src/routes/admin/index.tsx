import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  getAdminUsers,
  getAdminBusinesses,
  getAdminReviews,
  updateUserRole,
  deleteUser,
  deleteBusinessAdmin,
  deleteReviewAdmin,
} from '../../lib/api'
import { getToken, getUser, isLoggedIn } from '../../lib/auth'

export const Route = createFileRoute('/admin/')({
  component: AdminPage,
})

type AdminUser = {
  id: number
  name: string
  email: string
  role: 'CUSTOMER' | 'BUSINESS_OWNER' | 'ADMIN'
  createdAt: string
  _count: { reviews: number; businesses: number }
}

type AdminBusiness = {
  id: number
  name: string
  city: string | null
  averageRating: number
  reviewCount: number
  createdAt: string
  owner: { id: number; name: string; email: string }
}

type AdminReview = {
  id: number
  rating: number
  comment: string | null
  createdAt: string
  user: { id: number; name: string; email: string }
  business: { id: number; name: string }
}

type Tab = 'overview' | 'businesses' | 'reviews' | 'users'

function AdminPage() {
  const navigate = useNavigate()
  const [checked, setChecked] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  const [tab, setTab] = useState<Tab>('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  const [users, setUsers] = useState<AdminUser[]>([])
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([])
  const [reviews, setReviews] = useState<AdminReview[]>([])

  useEffect(() => {
    const user = getUser<{ id: number; name: string; role: string }>()
    if (!isLoggedIn() || !user || user.role !== 'ADMIN') {
      setAuthorized(false)
      setChecked(true)
      navigate({ to: '/' })
      return
    }
    setCurrentUserId(user.id)
    setAuthorized(true)
    setChecked(true)
  }, [navigate])

  useEffect(() => {
    if (!authorized) return

    const token = getToken()
    if (!token) return

    setLoading(true)
    setError('')

    Promise.all([
      getAdminUsers(token),
      getAdminBusinesses(token),
      getAdminReviews(token),
    ])
      .then(([usersData, businessesData, reviewsData]) => {
        setUsers(usersData)
        setBusinesses(businessesData)
        setReviews(reviewsData)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load admin data')
      })
      .finally(() => setLoading(false))
  }, [authorized])

  async function handleRoleChange(
    userId: number,
    role: 'CUSTOMER' | 'BUSINESS_OWNER' | 'ADMIN',
  ) {
    setActionError('')
    const token = getToken()
    if (!token) return

    try {
      const updated = await updateUserRole(userId, role, token)
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u)),
      )
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update role')
    }
  }

  async function handleDeleteUser(userId: number) {
    if (!window.confirm('Delete this user? This also deletes their businesses and reviews.')) {
      return
    }
    setActionError('')
    const token = getToken()
    if (!token) return

    try {
      await deleteUser(userId, token)
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setBusinesses((prev) => prev.filter((b) => b.owner.id !== userId))
      setReviews((prev) => prev.filter((r) => r.user.id !== userId))
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  async function handleDeleteBusiness(businessId: number) {
    if (!window.confirm('Delete this business? This also deletes its reviews.')) {
      return
    }
    setActionError('')
    const token = getToken()
    if (!token) return

    try {
      await deleteBusinessAdmin(businessId, token)
      setBusinesses((prev) => prev.filter((b) => b.id !== businessId))
      setReviews((prev) => prev.filter((r) => r.business.id !== businessId))
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete business')
    }
  }

  async function handleDeleteReview(reviewId: number) {
    if (!window.confirm('Delete this review?')) {
      return
    }
    setActionError('')
    const token = getToken()
    if (!token) return

    try {
      await deleteReviewAdmin(reviewId, token)
      setReviews((prev) => prev.filter((r) => r.id !== reviewId))
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete review')
    }
  }

  if (!checked) {
    return null
  }

  if (!authorized) {
    return null
  }

  const navItems: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'businesses', label: 'Businesses' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'users', label: 'Users' },
  ]

  return (
    <div className="flex min-h-screen bg-[#f7f1df] text-[#173f35]">
      <aside className="flex w-64 shrink-0 flex-col bg-[#174d3d] px-5 py-6 text-white">
        <a href="/" className="text-sm font-semibold text-white/70 hover:text-white">
          Back to Site
        </a>

        <div className="mt-8">
          <p className="text-xs uppercase tracking-wide text-white/50">
            Admin Panel
          </p>
          <p className="mt-1 text-lg font-bold text-[#f4c84a]">EthioRate HQ</p>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
                tab === item.key
                  ? 'bg-white/10 text-[#f4c84a]'
                  : 'text-white/80 hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 px-8 py-8">
        <h1 className="text-3xl font-bold">
          {navItems.find((n) => n.key === tab)?.label}
        </h1>

        {loading && (
          <p className="mt-6 text-sm text-[#718078]">Loading admin data...</p>
        )}

        {error && (
          <p className="mt-6 text-sm font-semibold text-red-600">{error}</p>
        )}

        {actionError && (
          <p className="mt-4 text-sm font-semibold text-red-600">{actionError}</p>
        )}

        {!loading && !error && tab === 'overview' && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-3xl font-bold">{businesses.length}</p>
              <p className="mt-1 text-sm text-[#718078]">Total Businesses</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-3xl font-bold">{reviews.length}</p>
              <p className="mt-1 text-sm text-[#718078]">Total Reviews</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-3xl font-bold">{users.length}</p>
              <p className="mt-1 text-sm text-[#718078]">Registered Users</p>
            </div>
          </div>
        )}

        {!loading && !error && tab === 'businesses' && (
          <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#eef1e8] text-[#718078]">
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">City</th>
                  <th className="px-5 py-3 font-semibold">Rating</th>
                  <th className="px-5 py-3 font-semibold">Reviews</th>
                  <th className="px-5 py-3 font-semibold">Owner</th>
                  <th className="px-5 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((b) => (
                  <tr key={b.id} className="border-b border-[#eef1e8] last:border-0">
                    <td className="px-5 py-3 font-semibold">{b.name}</td>
                    <td className="px-5 py-3">{b.city || '-'}</td>
                    <td className="px-5 py-3">{b.averageRating.toFixed(1)}</td>
                    <td className="px-5 py-3">{b.reviewCount}</td>
                    <td className="px-5 py-3">{b.owner.email}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteBusiness(b.id)}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {businesses.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-6 text-center text-[#718078]">
                      No businesses yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && tab === 'reviews' && (
          <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#eef1e8] text-[#718078]">
                  <th className="px-5 py-3 font-semibold">Business</th>
                  <th className="px-5 py-3 font-semibold">Rating</th>
                  <th className="px-5 py-3 font-semibold">Comment</th>
                  <th className="px-5 py-3 font-semibold">By</th>
                  <th className="px-5 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id} className="border-b border-[#eef1e8] last:border-0">
                    <td className="px-5 py-3 font-semibold">{r.business.name}</td>
                    <td className="px-5 py-3">{r.rating} / 5</td>
                    <td className="max-w-xs truncate px-5 py-3">{r.comment || '-'}</td>
                    <td className="px-5 py-3">{r.user.email}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(r.id)}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-6 text-center text-[#718078]">
                      No reviews yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && tab === 'users' && (
          <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#eef1e8] text-[#718078]">
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Reviews</th>
                  <th className="px-5 py-3 font-semibold">Businesses</th>
                  <th className="px-5 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-[#eef1e8] last:border-0">
                    <td className="px-5 py-3 font-semibold">{u.name}</td>
                    <td className="px-5 py-3">{u.email}</td>
                    <td className="px-5 py-3">
                      {u.id === currentUserId ? (
                        <span className="rounded-full bg-[#174d3d] px-3 py-1 text-xs font-semibold text-[#f4c84a]">
                          {u.role}
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleRoleChange(
                              u.id,
                              e.target.value as 'CUSTOMER' | 'BUSINESS_OWNER' | 'ADMIN',
                            )
                          }
                          className="rounded-lg border border-[#dfe4d8] bg-[#fafbf8] px-2 py-1 text-xs"
                        >
                          <option value="CUSTOMER">CUSTOMER</option>
                          <option value="BUSINESS_OWNER">BUSINESS_OWNER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      )}
                    </td>
                    <td className="px-5 py-3">{u._count.reviews}</td>
                    <td className="px-5 py-3">{u._count.businesses}</td>
                    <td className="px-5 py-3 text-right">
                      {u.id !== currentUserId && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id)}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-6 text-center text-[#718078]">
                      No users yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}