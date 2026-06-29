import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Plus, Search, ShieldCheck } from 'lucide-react'
import ScreenHeader, { CancelButton } from '../components/ScreenHeader'
import BottomNav from '../components/BottomNav'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { useTransfer } from '../lib/transfer'
import { COUNTRIES } from '../data/transfer'
import { DIRECTORY, resolveIdentifier } from '../data/directory'
import type { Country, Recipient } from '../types'
import shared from './shared.module.css'
import styles from './SendMoney.module.css'

type Tab = 'recent' | 'saved' | 'all'
const TABS: { key: Tab; label: string }[] = [
  { key: 'recent', label: 'Recent' },
  { key: 'saved', label: 'Saved' },
  { key: 'all', label: 'All contact' },
]

export default function SendMoney() {
  const navigate = useNavigate()
  const { recipient, setRecipient } = useTransfer()
  const [open, setOpen] = useState(false)
  const [country, setCountry] = useState<Country | null>(null)
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<Tab>('recent')

  const choose = (c: Recipient) => {
    setRecipient(c)
    navigate('/amount')
  }

  // Classify what the user typed: wallet address, phone number or email.
  const typed = query.trim()
  const isEmail = /^\S+@\S+\.\S+$/.test(typed)
  const isWallet = /^0x[a-fA-F0-9]{40}$/.test(typed)
  const isPhone = /^\+?[\d\s-]{7,}$/.test(typed) && typed.replace(/\D/g, '').length >= 7
  const typedKind: 'email' | 'phone' | 'wallet' | null = isEmail
    ? 'email'
    : isWallet
      ? 'wallet'
      : isPhone
        ? 'phone'
        : null

  // Directory matches for the query (by name, email, phone digits or address).
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    const qDigits = q.replace(/\D/g, '')
    return DIRECTORY.filter((c) => {
      if (!q) return tab === 'all' ? true : c.group === tab
      return (
        c.name.toLowerCase().includes(q) ||
        (c.email?.toLowerCase().includes(q) ?? false) ||
        (c.address?.toLowerCase().includes(q) ?? false) ||
        (qDigits.length >= 3 && c.phone.replace(/\D/g, '').includes(qDigits))
      )
    })
  }, [query, tab])

  // When a valid identifier is entered but nobody matches, generate a recipient
  // from the roster so the user always lands on a real person to send to.
  const generated = useMemo(
    () => (typedKind && matches.length === 0 ? resolveIdentifier(typed, typedKind) : null),
    [typedKind, typed, matches.length],
  )

  const results = matches

  // Continue needs BOTH fields filled: a selected country and a recipient —
  // either an existing contact already chosen or a valid new identifier typed.
  const canContinue = Boolean(country) && Boolean(typed) && Boolean(recipient || generated)

  const handleContinue = () => {
    if (!recipient && generated) {
      choose(generated)
      return
    }
    navigate('/amount')
  }

  return (
    <div className={shared.screen}>
      <ScreenHeader
        title="Send Money"
        subtitle="Who are you sending money to?"
        action={<CancelButton onClick={() => navigate('/home')} />}
      />

      <div className={styles.scroll}>
        <div className={styles.banner}>
          <ShieldCheck size={18} className={styles.bannerIcon} />
          Your transfer is protected with end-to-end security
        </div>

        <h2 className={styles.label}>SelectCountry</h2>

        <div className={styles.select}>
          <button type="button" className={styles.selectBtn} onClick={() => setOpen((v) => !v)}>
            <span className={styles.selectValue} data-selected={Boolean(country)}>
              <span style={{ fontSize: 18 }}>{country ? country.flag : '🇳🇬'}</span>
              {country ? country.name : '---Select a country----'}
            </span>
            <ChevronDown size={20} className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />
          </button>

          {open && (
            <div className={styles.menu}>
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  className={styles.option}
                  onClick={() => {
                    setCountry(c)
                    setOpen(false)
                  }}
                >
                  <span style={{ fontSize: 20 }}>{c.flag}</span>
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.search}>
          <Input
            placeholder="Enter wallet address, phone number or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leading={<Search size={18} />}
          />
        </div>

        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.contacts}>
          {results.length === 0 && !generated ? (
            <p className={styles.empty}>No contacts here yet.</p>
          ) : (
            results.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`${styles.contact} ${recipient?.id === c.id ? styles.contactActive : ''}`}
                onClick={() => choose(c)}
              >
                <span className={styles.contactName}>{c.name}</span>
                <span className={styles.contactPhone}>{c.email ?? c.phone}</span>
              </button>
            ))
          )}
        </div>

        {/* Only shown once a new wallet/phone/email (not an existing contact) is entered. */}
        {generated && (
          <button type="button" className={styles.addRecipient} onClick={() => choose(generated)}>
            <Plus size={18} className={styles.addIcon} />
            Add New Recipient
          </button>
        )}

        <p className={styles.disclaimer}>
          <ShieldCheck size={14} color="var(--color-accent)" />
          RemitChain does not store your PIN or Passwords
        </p>

        <Button
          fullWidth
          className={styles.continue}
          disabled={!canContinue}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
