import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, Check, Eye, ShieldCheck, TriangleAlert } from 'lucide-react'
import ScreenHeader from '../components/ScreenHeader'
import { Button } from '../components/Button'
import { useAuth } from '../lib/auth'
import { useWallet } from '../lib/walletStore'
import shared from './shared.module.css'
import styles from './BackupWallet.module.css'

/**
 * Recovery-phrase backup. Shown once during onboarding (right after the wallet
 * is created) and reachable later from Profile. Saving the phrase is the only
 * way to restore a self-custodial wallet, so it gets a dedicated, careful screen.
 */
export default function BackupWallet() {
  const navigate = useNavigate()
  const { recoveryPhrase } = useAuth()
  const { confirmBackup } = useWallet()
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)

  const phrase = recoveryPhrase()

  const copyPhrase = async () => {
    try {
      await navigator.clipboard.writeText(phrase.join(' '))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard blocked */
    }
  }

  const finish = () => {
    confirmBackup()
    navigate('/wallet', { replace: true })
  }

  return (
    <div className={shared.screen}>
      <ScreenHeader title="Recovery phrase" onBack={() => navigate(-1)} />

      <div className={styles.scroll}>
        <div className={styles.iconTile}>
          <ShieldCheck size={34} />
        </div>
        <h1 className={styles.title}>Back up your wallet</h1>
        <p className={styles.subtitle}>
          These 12 words are the master key to your wallet. Write them down in order and store them
          somewhere safe and offline.
        </p>

        <div className={styles.warning}>
          <TriangleAlert size={18} />
          <span>Never share your phrase. Anyone with it can take your funds. RemitChain can never recover it for you.</span>
        </div>

        <div className={styles.phraseWrap}>
          <div className={styles.phrase} data-blurred={!revealed}>
            {phrase.map((word, i) => (
              <div key={i} className={styles.word}>
                <span className={styles.index}>{i + 1}</span>
                {word}
              </div>
            ))}
          </div>
          {!revealed && (
            <button type="button" className={styles.reveal} onClick={() => setRevealed(true)}>
              <Eye size={18} />
              Tap to reveal
            </button>
          )}
        </div>

        {revealed && (
          <button type="button" className={styles.copyBtn} onClick={copyPhrase}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied to clipboard' : 'Copy phrase'}
          </button>
        )}

        <label className={styles.ack}>
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
          />
          <span>I have written down my recovery phrase and understand it cannot be recovered if lost.</span>
        </label>
      </div>

      <div className={styles.footer}>
        <Button fullWidth onClick={finish} disabled={!revealed || !acknowledged}>
          I've saved it
        </Button>
      </div>
    </div>
  )
}
