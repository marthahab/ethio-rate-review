

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/welcome')({
  component: WelcomePage,
})

function WelcomePage() {
  return (
    <main className="min-h-screen bg-[#f7f5ed] px-6 py-12 text-[#173f35]">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl flex-col items-center justify-center">

        {/* Logo */}
        <a href="/" className="mb-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#174d3d] text-xl text-[#f4c84a]">
            ★
          </div>

          <span className="text-2xl font-bold tracking-tight">
            Ethio<span className="text-[#174d3d]">Rate</span>
          </span>
        </a>

        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#c99718]">
            Welcome to EthioRate
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-[#173f35] sm:text-5xl">
            How would you like to join?
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#718078]">
            Create an account to discover businesses, share your experiences,
            or manage your business listing.
          </p>
        </div>

        {/* Account choices */}
        <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">

          {/* Customer */}
          <a
            href="/register"
            className="group rounded-3xl border border-[#dfe4d8] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-[#174d3d] hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef1e8] text-3xl transition group-hover:bg-[#174d3d]">
              👤
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#173f35]">
              Customer
            </h2>

            <span className="mt-4 inline-block rounded-full bg-[#174d3d] px-5 py-2 text-sm font-bold text-[#f4c84a]">
              Join as a Customer
            </span>

            <p className="mt-5 leading-7 text-[#718078]">
              Discover local businesses, read reviews, rate your experiences,
              and help other people make better decisions.
            </p>
          </a>

          {/* Business Owner */}
          <a
            href="/businesses/register"
            className="group rounded-3xl border border-[#dfe4d8] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-[#174d3d] hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef1e8] text-3xl transition group-hover:bg-[#174d3d]">
              🏪
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#173f35]">
              Business Owner
            </h2>

            <span className="mt-4 inline-block rounded-full bg-[#174d3d] px-5 py-2 text-sm font-bold text-[#f4c84a]">
              Manage Your Listing
            </span>

            <p className="mt-5 leading-7 text-[#718078]">
              Claim your business, respond to reviews, update your information,
              and manage your online presence.
            </p>
          </a>

        </div>

        {/* Sign in */}
        <p className="mt-10 text-[#5f665f]">
          Already have an account?{' '}
          <a
            href="/login"
            className="font-bold text-[#174d3d] hover:underline"
          >
            Sign in
          </a>
        </p>

        {/* Back */}
        <a
          href="/"
          className="mt-5 text-sm font-semibold text-[#718078] hover:text-[#174d3d]"
        >
          ← Back to homepage
        </a>

      </div>
    </main>
  )
}
