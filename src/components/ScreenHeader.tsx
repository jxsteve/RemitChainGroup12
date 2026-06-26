import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface ScreenHeaderProps {
  title: string
}

/** Back arrow + centered title used on the inner flow screens. */
export default function ScreenHeader({ title }: ScreenHeaderProps) {
  const navigate = useNavigate()
  return (
    <header className="relative flex items-center px-5 pb-2 pt-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="absolute left-5 text-gray-700"
      >
        <ArrowLeft className="h-6 w-6" strokeWidth={2.25} />
      </button>
      <h1 className="w-full text-center text-lg font-bold text-gray-900">
        {title}
      </h1>
    </header>
  )
}
