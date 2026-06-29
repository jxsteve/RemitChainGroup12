import styles from './Splash.module.css'

/**
 * Brand splash shown on app start (~2.5s): diagonal gray/blue/gray bands across
 * the upper area, with the RemitChain wordmark + tagline anchored bottom-left.
 */
export default function Splash() {
  return (
    <div className={styles.screen}>
      <div className={styles.art} aria-hidden>
        <span className={`${styles.band} ${styles.grayTop}`} />
        <span className={`${styles.band} ${styles.blue}`} />
        <span className={`${styles.band} ${styles.grayBottom}`} />
      </div>

      <div className={styles.bottom}>
        <span className={styles.wordmark} aria-label="RemitChain">
          <span className={styles.remit}>Remit</span>
          <span className={styles.chain}>Chain</span>
        </span>
        <p className={styles.tagline}>Send money across Africa in seconds</p>
      </div>
    </div>
  )
}
