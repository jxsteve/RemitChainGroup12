import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { useAuth } from '../lib/auth'
import shared from './shared.module.css'
import styles from './CreateAccount.module.css'

export default function CreateAccount() {
  const navigate = useNavigate()
  const { startSignup } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const phoneValid = phone.replace(/\D/g, '').length >= 10
  const canSubmit = Boolean(
    firstName.trim() && lastName.trim() && /\S+@\S+\.\S+/.test(email) && phoneValid,
  )

  const handleSignup = () => {
    startSignup({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    })
    navigate('/verify-email')
  }

  return (
    <div className={shared.screen}>
      <div className={shared.scroll}>
        <div className={styles.head}>
          <button type="button" className={styles.back} aria-label="Go back" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} strokeWidth={2.25} />
          </button>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Let's get you started</p>
        </div>

        <div className={shared.body}>
          <div className={styles.form}>
            <Input
              label="First Name"
              placeholder="Enter First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              label="Last Name"
              placeholder="Enter Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leading={<span className={styles.flag}>🇳🇬</span>}
              trailing={phoneValid ? <Check size={18} color="var(--color-success)" strokeWidth={3} /> : null}
            />
          </div>
        </div>
      </div>

      <div className={shared.bottom}>
        <Button fullWidth disabled={!canSubmit} onClick={handleSignup}>
          Sign Up
        </Button>
        <p className={shared.footnote}>
          Already have an account?
          <button className={shared.linkBtn} onClick={() => navigate('/login')}>
            Log in
          </button>
        </p>
      </div>
    </div>
  )
}
