import { useState } from 'react'
import { useSignUp } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import '../login.css'

function VerifyEmailPage() {
  const { signUp, isLoaded } = useSignUp()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleVerify(event) {
    event.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setError('')

    try {
      const result = await signUp.attemptEmailAddressVerification({ code })

      if (result.status === 'complete') {
        navigate('/home')
      } else {
        setError('Verification incomplete. Please try again.')
      }
    } catch (err) {
      const message = err?.errors?.[0]?.message || 'Invalid code. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResend() {
    if (!isLoaded) return
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setError('New code sent! Check your email.')
    } catch (err) {
      setError('Failed to resend code. Please try again.')
    }
  }

  return (
    <main className="login-page">
      <div className="login-bg-orb login-bg-orb-one" />
      <div className="login-bg-orb login-bg-orb-two" />

      <section className="login-shell" aria-labelledby="verify-title">
        <div className="brand-section">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 64 64" role="img">
              <path
                d="M18 20c0-5.5 4.5-10 10-10h8c5.5 0 10 4.5 10 10v24c0 5.5-4.5 10-10 10h-8c-5.5 0-10-4.5-10-10V20Z"
                fill="#E0F2FE"
              />
              <path
                d="M20 22h24M20 31h24M20 40h16"
                stroke="#18A7FF"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M46 15l2.2-4.2L50.5 15l4.2 2.2-4.2 2.2-2.3 4.3-2.2-4.3-4.2-2.2L46 15Z"
                fill="#FFD166"
              />
            </svg>
          </div>
          <h1 id="verify-title">Verify Email</h1>
          <p>Enter the code sent to your email</p>
        </div>

        <div className="login-card">
          <form className="login-form" onSubmit={handleVerify} noValidate>
            <div className="field-group">
              <label htmlFor="code">Verification Code</label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
              />
            </div>

            {error ? (
              <div
                className={error.includes('sent') ? 'success-message' : 'error-message'}
                role="alert"
              >
                {error}
              </div>
            ) : null}

            <button className="primary-button" type="submit" disabled={isLoading || !isLoaded}>
              {isLoading ? <span className="spinner" aria-hidden="true" /> : null}
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>

            <button
              className="google-button"
              type="button"
              onClick={handleResend}
              disabled={!isLoaded}
              style={{ marginTop: '10px' }}
            >
              Resend Code
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default VerifyEmailPage
