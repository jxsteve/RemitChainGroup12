import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronRight, Plus, Search, ShieldCheck } from 'lucide-react'
import ScreenHeader from '../components/ScreenHeader'
import BottomNav from '../components/BottomNav'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { COUNTRIES } from '../data/transfer'
import type { Country } from '../types'
import shared from './shared.module.css'
import styles from './SendMoney.module.css'

export default function SendMoney() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [country, setCountry] = useState<Country | null>(null)
  const [query, setQuery] = useState('')

  return (
    <div className={shared.screen}>
      <ScreenHeader title="Send Money" subtitle="Who are you sending money to?" />

      <div className={styles.scroll}>
        <div className={styles.banner}>
          <ShieldCheck size={18} className={styles.bannerIcon} />
          Your transfer is protected with end-to-end security
        </div>

        <h2 className={styles.label}>SelectCountry</h2>

        <div className={styles.select}>
          <button type="button" className={styles.selectBtn} onClick={() => setOpen((v) => !v)}>
            <span className={styles.selectValue} data-selected={Boolean(country)}>
              {country ? (
                <>
                  <span style={{ fontSize: 18 }}>{country.flag}</span>
                  {country.name}
                </>
              ) : (
                <>
                  <span style={{ fontSize: 18 }}>🇳🇬</span>
                  ---Select a country----
                </>
              )}
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

        <button type="button" className={styles.addRecipient} onClick={() => navigate('/amount')}>
          <Plus size={22} className={styles.addIcon} />
          <span className={styles.addText}>
            <span className={styles.addTitle}>Add New Recipient</span>
            <span className={styles.addSub} style={{ display: 'block' }}>
              Enter details manually
            </span>
          </span>
          <ChevronRight size={20} color="var(--color-text-muted)" />
        </button>

        <p className={styles.disclaimer}>
          <ShieldCheck size={14} color="var(--color-accent)" />
          RemitChain does not store your PIN or Passwords
        </p>
      </div>

      <div className={styles.footer}>
        <Button fullWidth disabled={!country} onClick={() => navigate('/amount')}>
          Continue
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
