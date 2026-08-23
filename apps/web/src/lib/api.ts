export type Business = {
  id: number
  name: string
  description?: string | null
  address?: string | null
  city?: string | null
  latitude?: number | null
  longitude?: number | null
  phone?: string | null
  website?: string | null
  averageRating: number
  reviewCount: number
  googleMapsUrl?: string | null
  imageUrl?: string | null

  categories: {
    businessId: number
    categoryId: number
    category: {
      id: number
      name: string
      description?: string | null
    }
  }[]

  reviews?: {
  id: number
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
  userId: number
  businessId: number
  user: {
    id: number
    name: string
  }
}[]
}

type BusinessesResponse = {
  data: Business[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

const API_URL = 'http://localhost:3001'

export async function getTopRatedBusinesses(): Promise<Business[]> {
  const response = await fetch(
    `${API_URL}/businesses?sort=rating&limit=12`,
  )

  if (!response.ok) {
    throw new Error('Failed to fetch businesses')
  }

  const result: BusinessesResponse = await response.json()

  return result.data
}

export async function getBusinessesByCategory(
  category: string,
): Promise<Business[]> {
  const response = await fetch(
    `${API_URL}/businesses?category=${encodeURIComponent(category)}&limit=6`,
  )

  if (!response.ok) {
    throw new Error('Failed to fetch businesses by category')
  }

  const result: BusinessesResponse = await response.json()

  return result.data
}

export async function searchBusinesses(
  query: string,
): Promise<Business[]> {
  const response = await fetch(
    `${API_URL}/businesses?search=${encodeURIComponent(query)}&limit=6`,
  )

  if (!response.ok) {
    throw new Error('Failed to search businesses')
  }

  const result: BusinessesResponse = await response.json()

  return result.data
}

export async function createReview(
  businessId: number,
  rating: number,
  comment: string,
  token: string,
) {
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      businessId,
      rating,
      comment,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || 'Failed to create review')
  }

  return response.json()
}

export async function register(
  name: string,
  email: string,
  password: string,
  role?: 'CUSTOMER' | 'BUSINESS_OWNER',
) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || 'Failed to register')
  }

  return response.json()
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || 'Failed to login')
  }

  return response.json()
}

export async function createBusiness(
  data: {
    name: string
    description?: string
    address?: string
    city?: string
    phone?: string
    imageUrl?: string
    category?: string
  },
  token: string,
) {  const response = await fetch(`${API_URL}/businesses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || 'Failed to create business')
  }

  return response.json()
}

export async function getAdminUsers(token: string) {
  const response = await fetch(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || 'Failed to load users')
  }
  return response.json()
}

export async function updateUserRole(
  userId: number,
  role: 'CUSTOMER' | 'BUSINESS_OWNER' | 'ADMIN',
  token: string,
) {
  const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || 'Failed to update role')
  }
  return response.json()
}

export async function deleteUser(userId: number, token: string) {
  const response = await fetch(`${API_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || 'Failed to delete user')
  }
  return response.json()
}

export async function getAdminBusinesses(token: string) {
  const response = await fetch(`${API_URL}/admin/businesses`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || 'Failed to load businesses')
  }
  return response.json()
}

export async function deleteBusinessAdmin(businessId: number, token: string) {
  const response = await fetch(`${API_URL}/admin/businesses/${businessId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || 'Failed to delete business')
  }
  return response.json()
}

export async function getAdminReviews(token: string) {
  const response = await fetch(`${API_URL}/admin/reviews`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || 'Failed to load reviews')
  }
  return response.json()
}

export async function deleteReviewAdmin(reviewId: number, token: string) {
  const response = await fetch(`${API_URL}/admin/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || 'Failed to delete review')
  }
  return response.json()
}

export async function getMyBusinesses(token: string) {
  const response = await fetch(`${API_URL}/businesses/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || 'Failed to load your businesses')
  }
  return response.json()
}

export async function updateBusiness(
  businessId: number,
  data: {
    name?: string
    description?: string
    address?: string
    city?: string
    phone?: string
    website?: string
    googleMapsUrl?: string
    imageUrl?: string
  },
  token: string,
) {  const response = await fetch(`${API_URL}/businesses/${businessId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || 'Failed to update business')
  }
  return response.json()
}