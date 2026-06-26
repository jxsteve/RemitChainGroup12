import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navigation } from 'lucide-react'

export default function Processing() {
  const navigate = useNavigate()

  // Return to home after the simulated transfer completes.
  useEffect(() => {
    const t = setTimeout(() => navigate('/'), 4000)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="pt-4 text-center">
        <h1 className="text-base font-medium text-gray-800">Processing</h1>
      </header>

      <div className="flex flex-1 flex-col items-center px-6 pt-24">
        <div className="flex h-36 w-36 items-center justify-center rounded-full border-2 border-primary/40 bg-white shadow-sm">
          <Navigation
            className="h-10 w-10 -rotate-12 text-gray-900"
            strokeWidth={2}
          />
        </div>

        <h2 className="mt-10 text-2xl font-extrabold text-gray-900">
          Sending Your Money...
        </h2>
        <p className="mt-3 text-center text-base text-gray-500">
          Please do not close the app
          <br />
          or refresh the page
        </p>
      </div>
    </div>
  )
}
