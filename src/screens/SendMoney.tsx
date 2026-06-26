import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { cn } from '../lib/cn'
import ScreenHeader from '../components/ScreenHeader'
import BottomNav from '../components/BottomNav'
import { COUNTRIES } from '../data/transfer'

export default function SendMoney() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string>('')

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScreenHeader title="Send Money" />

      <div className="flex-1 overflow-y-auto px-6 pt-8">
        {/* Heading matches the design hand-off exactly ("SelectCountry"). */}
        <h2 className="text-xl font-extrabold text-gray-900">SelectCountry</h2>

        <div className="relative mt-4">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-2xl bg-white px-5 py-4 text-left shadow-lg ring-1 ring-black/5"
          >
            <span
              className={cn(
                'text-base',
                selected ? 'text-gray-900' : 'text-gray-400',
              )}
            >
              {selected || '---Select a country----'}
            </span>
            <ChevronDown
              className={cn(
                'h-5 w-5 text-gray-500 transition-transform',
                open && 'rotate-180',
              )}
              strokeWidth={2.25}
            />
          </button>

          {open && (
            <ul className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl bg-white py-1 shadow-xl ring-1 ring-black/5">
              {COUNTRIES.map((c) => (
                <li key={c.code}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(`${c.flag}  ${c.name}`)
                      setOpen(false)
                      navigate('/amount')
                    }}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left text-base text-gray-800 hover:bg-gray-50"
                  >
                    <span className="text-xl">{c.flag}</span>
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
