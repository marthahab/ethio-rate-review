import { createFileRoute } from '@tanstack/react-router'
import {
  getTopRatedBusinesses,
  searchBusinesses,
  getBusinessesByCategory,
} from '../lib/api'
import { useState, useEffect, useRef } from 'react'
import { getUser, clearAuth } from '../lib/auth'

export const Route = createFileRoute('/')({
  loader: () => getTopRatedBusinesses(),
  component: Home,
})

function Home() {
  const businesses = Route.useLoaderData()
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<typeof businesses>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categoryResults, setCategoryResults] = useState<typeof businesses>([])
  const [isCategoryLoading, setIsCategoryLoading] = useState(false)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const searchResultsRef = useRef<HTMLDivElement>(null)
  const categoryResultsRef = useRef<HTMLDivElement>(null)

  const heroImages = [
    '/stake.jpg',
   '/readrink.jpg',
    '/spa.jpg',
    '/breath.jpg',
    '/glamour.jpg',
  ]
  const [heroSlide, setHeroSlide] = useState(0)

  useEffect(() => {
    setUser(getUser())
  }, [])

  useEffect(() => {
    if (heroImages.length < 2) return
    const interval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  useEffect(() => {
    if (searchResults.length > 0 && searchResultsRef.current) {
      searchResultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [searchResults])

  useEffect(() => {
    if (selectedCategory && categoryResultsRef.current) {
      categoryResultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedCategory, categoryResults])

  function handleLogout() {
    clearAuth()
    setUser(null)
    window.location.href = '/'
  }

  return (
    <main className="min-h-screen bg-[#f7f5ed] text-[#173f35]">
     
      <nav className="sticky top-0 z-50 border-b border-[#dfe4d8] bg-[#f7f5ed]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#174d3d] text-lg text-[#f4c84a]">
              *
            </div>
            <span className="text-xl font-bold tracking-tight">
              Ethio<span className="text-[#174d3d]">Rate</span>
            </span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="/" className="text-[#174d3d] transition hover:text-[#c99718]">
              Home
            </a>
            <a href="#explore" className="text-[#617066] transition hover:text-[#174d3d]">
              Explore
            </a>
            <a href="/dashboard" className="text-[#617066] transition hover:text-[#174d3d]">
              Dashboard
            </a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden text-sm font-semibold text-[#173f35] sm:block">
                  Hi, {user.name}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-[#174d3d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f392d]"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="hidden rounded-full px-5 py-2.5 text-sm font-semibold text-[#174d3d] transition hover:bg-[#e8eadf] sm:block">
                  Sign In
                </a>
                <a href="/welcome" className="rounded-full bg-[#174d3d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f392d]">
                  Join Free
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      <style>{`@keyframes heroZoom { from { transform: scale(1.1) } to { transform: scale(1) } }`}</style>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden text-white">

        {/* Hero Background */}
        {heroImages.length > 0 && (
          <div className="absolute inset-0">
            {heroImages.map((url, index) => (
              <div
                key={url + index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === heroSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={url}
                  alt={`Hero background ${index + 1}`}
                  className={`h-full w-full object-cover ${
                    index === heroSlide ? 'animate-[heroZoom_7s_ease-out_forwards]' : ''
                  }`}
                />
              </div>
            ))}

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80" />
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-6 text-center lg:px-8">

          {/* Logo Icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/10 text-2xl text-[#f4c84a] backdrop-blur-md">
            *
          </div>

          {/* Brand */}
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/90">
            EthioRate
          </p>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            Discover places
            <br />
            <span className="text-[#f4c84a]">
              worth talking about.
            </span>
          </h1>

          {/* Buttons */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">

            <a
              href="/welcome"
              className="rounded-full bg-[#f4c84a] px-8 py-3 font-semibold text-[#173f35] shadow-lg transition hover:bg-[#e6b938]"
            >
              Get Started
            </a>

            <a
              href="#explore"
              className="rounded-full border border-white/50 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              Browse Categories
            </a>

          </div>

          {/* Search */}
          <div className="flex w-full max-w-4xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-2xl sm:flex-row">

            <div className="flex flex-1 items-center gap-3 px-4">

              <span className="text-xl text-[#718078]">
                Search
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Restaurant, cafe, service..."
                className="w-full bg-transparent py-3 text-sm text-[#173f35] outline-none placeholder:text-[#8b968f]"
              />

            </div>

            <button
              type="button"
              onClick={async () => {
                if (!search.trim()) {
                  setSearchResults([])
                  return
                }

                try {
                  setIsSearching(true)
                  const results = await searchBusinesses(search.trim())
                  setSearchResults(results)
                } catch (error) {
                  console.error('Search failed:', error)
                } finally {
                  setIsSearching(false)
                }
              }}
              className="rounded-xl bg-[#174d3d] px-8 py-3 font-semibold text-[#f4c84a] transition hover:bg-[#0f392d]"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>

          </div>

          {/* Slide Indicators */}
          {heroImages.length > 1 && (
            <div className="flex items-center justify-center gap-2">
              {heroImages.map((url, index) => (
                <button
                  key={url + index}
                  type="button"
                  onClick={() => setHeroSlide(index)}
                  aria-label={`Show slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    index === heroSlide
                      ? 'w-8 bg-[#f4c84a]'
                      : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

        </div>

      </section>

      {search.trim() && (
        <section ref={searchResultsRef} className="bg-[#f7f5ed] px-6 py-12 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#c99718]">
                Search results
              </p>
              <h2 className="text-3xl font-bold text-[#173f35]">
                Results for "{search}"
              </h2>
            </div>

            {searchResults.length === 0 && !isSearching ? (
              <div className="rounded-2xl border border-[#dfe4d8] bg-white p-8 text-center">
                <p className="text-[#718078]">No businesses found.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((business) => (
                    
                  <a  key={business.id}
                    href={`/businesses/${business.id}`}
                    className="block overflow-hidden rounded-2xl border border-[#dfe4d8] bg-white transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="h-40 overflow-hidden bg-[#dfe8d9]">
                      {business.imageUrl ? (
                        <img src={business.imageUrl} alt={business.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-5xl">Shop</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#c99718]">
                        {business.categories[0]?.category.name ?? 'Business'}
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-[#173f35]">
                        {business.name}
                      </h3>
                      <p className="mt-1 text-sm text-[#718078]">
                        {business.city ?? 'Ethiopia'}
                        {business.address ? ` - ${business.address}` : ''}
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="font-bold text-[#173f35]">
                          {business.averageRating.toFixed(1)}
                        </span>
                        <span className="text-sm text-[#718078]">
                          ({business.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section id="explore" className="bg-[#f7f5ed] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#c99718]">
                Explore
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-[#173f35] sm:text-4xl">
                Browse by category
              </h2>
              <p className="mt-3 max-w-xl text-[#718078]">
                Find businesses based on what you're looking for.
              </p>
            </div>
            <button className="hidden text-sm font-semibold text-[#174d3d] sm:block">
              View all
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { name: 'Coffee', image: '/image.png' },
              { name: 'Restaurants', image: '/imagecopy2.png' },
              { name: 'Hotels', image: '/imagecopy3.png' },
              { name: 'Shopping', image: '/imagecopy4.png' },
              { name: 'Beauty', image: '/imagecopy5.png' },
              { name: 'Services', image: '/imagecopy6.png' },
            ].map((category) => (
              <button
                key={category.name}
                type="button"
                onClick={async () => {
                  try {
                    setIsCategoryLoading(true)
                    setSelectedCategory(category.name)
                    setSearch('')
                    setSearchResults([])
                    const results = await getBusinessesByCategory(category.name)
                    setCategoryResults(results)
                  } catch (error) {
                    console.error('Category search failed:', error)
                    setCategoryResults([])
                  } finally {
                    setIsCategoryLoading(false)
                  }
                }}
                className="group rounded-2xl border border-[#dfe4d8] bg-white p-6 text-left transition hover:-translate-y-1 hover:border-[#174d3d] hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef1e8] overflow-hidden transition group-hover:bg-[#174d3d]">
                  {'image' in category && category.image ? (
                    <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl">{category.name.charAt(0)}</span>
                  )}
                </div>
                <h3 className="font-semibold text-[#173f35]">{category.name}</h3>
                <p className="mt-1 text-xs text-[#8a958e]">Explore businesses</p>
              </button>
            ))}
          </div>

          {selectedCategory && (
            <section ref={categoryResultsRef} className="bg-[#f7f5ed] px-6 pb-20 lg:px-8">
              <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-end justify-between">
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#c99718]">
                      Category
                    </p>
                    <h2 className="text-3xl font-bold text-[#173f35]">
                      {selectedCategory} businesses
                    </h2>
                    <p className="mt-2 text-[#718078]">
                      Businesses found in this category.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('')
                      setCategoryResults([])
                    }}
                    className="text-sm font-semibold text-[#174d3d] hover:underline"
                  >
                    Clear
                  </button>
                </div>

                {isCategoryLoading ? (
                  <div className="rounded-2xl bg-white p-8 text-center">
                    <p className="text-[#718078]">Loading businesses...</p>
                  </div>
                ) : categoryResults.length === 0 ? (
                  <div className="rounded-2xl bg-white p-8 text-center">
                    <p className="text-[#718078]">No businesses found in this category.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryResults.map((business) => (
                        
                       <a key={business.id}
                        href={`/businesses/${business.id}`}
                        className="block overflow-hidden rounded-2xl border border-[#dfe4d8] bg-white transition hover:-translate-y-1 hover:shadow-xl"
                      >
                        <div className="h-40 overflow-hidden bg-[#dfe8d9]">
                          {business.imageUrl ? (
                            <img src={business.imageUrl} alt={business.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <span className="text-5xl">Shop</span>
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#c99718]">
                            {business.categories[0]?.category.name ?? 'Business'}
                          </span>
                          <h3 className="mt-2 text-xl font-bold text-[#173f35]">
                            {business.name}
                          </h3>
                          <p className="mt-1 text-sm text-[#718078]">
                            {business.city ?? 'Ethiopia'}
                            {business.address ? ` - ${business.address}` : ''}
                          </p>
                          <div className="mt-4 flex items-center gap-2">
                            <span className="font-bold text-[#173f35]">
                              {business.averageRating.toFixed(1)}
                            </span>
                            <span className="text-sm text-[#718078]">
                              ({business.reviewCount} reviews)
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#c99718]">
              Community favorites
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#173f35] sm:text-4xl">
              Top-rated this week
            </h2>
            <p className="mt-3 text-[#718078]">
              Discover businesses loved by the community.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="overflow-hidden rounded-2xl border border-[#dfe4d8] bg-[#f7f5ed] transition hover:-translate-y-1 hover:shadow-xl"
              >
                <a href={`/businesses/${business.id}`} className="block">
                  <div className="h-48 overflow-hidden bg-[#dfe8d9]">
                    {business.imageUrl ? (
                      <img src={business.imageUrl} alt={business.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-5xl">Shop</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-full bg-[#174d3d] px-3 py-1 text-xs font-semibold text-white">
                        Verified
                      </span>
                      <span className="text-sm text-[#718078]">
                        {business.categories[0]?.category.name ?? 'Business'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#173f35]">
                      {business.name}
                    </h3>
                    <p className="mt-1 text-sm text-[#718078]">
                      {business.city ?? 'Ethiopia'}
                      {business.address ? ` - ${business.address}` : ''}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-lg font-bold text-[#173f35]">
                        {business.averageRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-[#718078]">
                        ({business.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </a>
                {business.googleMapsUrl && (
                  <div className="px-5 pb-5">
                    <a href={business.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-[#174d3d] hover:underline"
                    >
                      View location
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
