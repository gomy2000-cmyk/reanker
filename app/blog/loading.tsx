export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center">
          <div className="h-5 w-24 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 pt-14 sm:pt-20 pb-16">
        <div className="mb-12">
          <div className="h-4 w-12 bg-gray-100 rounded mb-3 animate-pulse" />
          <div className="h-9 w-2/3 bg-gray-100 rounded mb-3 animate-pulse" />
          <div className="h-4 w-full max-w-xl bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="space-y-6 border-y border-gray-200 py-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
              <div className="h-6 w-3/4 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
