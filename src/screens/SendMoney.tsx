import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Plus, Search, ShieldCheck } from 'lucide-react'
import ScreenHeader, { CancelButton } from '../components/ScreenHeader'
import BottomNav from '../components/BottomNav'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { useTransfer } from '../lib/transfer'
import { COUNTRIES, CONTACTS } from '../data/transfer'
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

  const contacts = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CONTACTS.filter((c) => {
      if (tab === 'saved' && c.group !== 'saved') return false
      if (!q) return true
      return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.wallet.toLowerCase().includes(q)
    })
  }, [query, tab])

  const choose = (c: Recipient) => {
    setRecipient(c)
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
            placeholder="search by name, phone or wallet ID"
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
          {contacts.length === 0 ? (
            <p className={styles.empty}>No contacts here yet.</p>
          ) : (
            contacts.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`${styles.contact} ${recipient?.id === c.id ? styles.contactActive : ''}`}
                onClick={() => choose(c)}
              >
                <span className={styles.contactName}>{c.name}</span>
                <span className={styles.contactPhone}>{c.phone}</span>
              </button>
            ))
          )}
        </div>

        <button type="button" className={styles.addRecipient} onClick={() => choose(CONTACTS[1])}>
          <Plus size={18} className={styles.addIcon} />
          Add New Recipient
        </button>

        <p className={styles.disclaimer}>
          <ShieldCheck size={14} color="var(--color-accent)" />
          RemitChain does not store your PIN or Passwords
        </p>

        <Button
          fullWidth
          className={styles.continue}
          disabled={!recipient}
          onClick={() => navigate('/amount')}
        >
          Continue
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
