import { useState, useRef, useEffect } from 'react'
import { useSignUp } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import '../login.css'

export default function ShopkeeperRegisterPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const navigate = useNavigate()

  // Form States
  const [shopName, setShopName] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  
  // Custom States for Password eye
  const [showPassword, setShowPassword] = useState(false)
  
  // Navigation & Screen View States
  const [pendingVerification, setPendingVerification] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false) // Success state for the checklist animation
  
  // Custom OTP Array State
  const [otp, setOtp] = useState(new Array(6).fill(''))
  const [resendTimer, setResendTimer] = useState(30)
  const inputRefs = useRef([])

  // Resend Timer logic
  useEffect(() => {
    let interval
    if (pendingVerification && resendTimer > 0 && !isSuccess) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [pendingVerification, resendTimer, isSuccess])

  // --- AUTOMATIC OTP SUBMIT LOGIC ---
  useEffect(() => {
    const finalCode = otp.join('')
    if (finalCode.length === 6 && isLoaded && !loading && !isSuccess) {
      autoVerifyOtp(finalCode)
    }
  }, [otp, isLoaded])

  // Helper function to get password strength state
  const getPasswordState = () => {
    if (!password) return { type: 'empty', color: '#1c1c1f', text: 'Your password must contain 8 or more characters.' }
    if (password.length < 8) return { type: 'weak', color: '#1c1c1f', text: 'Your password must contain 8 or more characters.' }
    if (password.length >= 8 && password.length < 12) return { type: 'warning', color: '#ea580c', text: 'Your password works, but could be stronger. Try adding more characters.' }
    return { type: 'strong', color: '#22c55e', text: 'Your password meets all the necessary requirements.' }
  }

  const pwdState = getPasswordState()

  // Handle Initial Email/Password Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLoaded) return

    setLoading(true)
    setError('')
    setIsTransitioning(true)

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName: shopName,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      
      setTimeout(() => {
        setIsTransitioning(false)
        setPendingVerification(true)
        setResendTimer(30)
        setOtp(new Array(6).fill(''))
      }, 800)

    } catch (err) {
      setIsTransitioning(false)
      setError(err.errors ? err.errors[0].longMessage : err.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP Inputs Change & Focus Shift
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false

    const newOtp = [...otp]
    newOtp[index] = element.value.slice(-1)
    setOtp(newOtp)

    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  // Automatic Verification Execution
  const autoVerifyOtp = async (codeValue) => {
    setLoading(true)
    setError('')

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code: codeValue })
      
      if (completeSignUp.status === 'complete') {
        setIsSuccess(true) // Set success state first to trigger visual response
        await setActive({ session: completeSignUp.createdSessionId })
        
        // Chota sa pause taaki user "Success" green text dekh sake, fir landing dashboard pr
        setTimeout(() => {
          navigate('/dashboard')
        }, 900)
      }
    } catch (err) {
      setError(err.errors ? err.errors[0].longMessage : err.message)
      setOtp(new Array(6).fill(''))
      if (inputRefs.current[0]) inputRefs.current[0].focus()
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyFormSubmit = (e) => {
    e.preventDefault()
    const finalCode = otp.join('')
    if (finalCode.length < 6) {
      setError('Please enter all 6 digits.')
      return
    }
    autoVerifyOtp(finalCode)
  }

  const handleResendCode = async () => {
    if (!isLoaded || resendTimer > 0 || isSuccess) return
    setError('')
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setResendTimer(30)
      setOtp(new Array(6).fill(''))
      if (inputRefs.current[0]) inputRefs.current[0].focus()
    } catch (err) {
      setError(err.errors ? err.errors[0].longMessage : err.message)
    }
  }

  return (
    <main className="login-page" style={{ backgroundColor: '#09090b', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflowY: 'auto', padding: '40px 20px', boxSizing: 'border-box' }}>
      <div className="login-bg-orb login-bg-orb-one" />
      <div className="login-bg-orb login-bg-orb-two" />

      <section className="login-shell" aria-labelledby="register-title" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        
        {/* Main Logo and Brand Header */}
        <div className="brand-section" style={{ marginBottom: '28px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #181922 0%, #111218 100%)', 
            border: '1px solid rgba(255, 255, 255, 0.08)', 
            borderRadius: '28px', 
            width: '80px', 
            height: '80px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: '24px', 
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}>
            <svg width="42" height="42" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="14" y="10" width="20" height="28" rx="10" fill="#E0F2FE" />
              <line x1="18" y1="17" x2="30" y2="17" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
              <line x1="18" y1="23" x2="30" y2="23" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
              <line x1="18" y1="29" x2="27" y2="29" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
              <path d="M32 12C32 12 34.5 12 35.5 9.5C36.5 12 39 12 39 12C39 12 36.5 12 35.5 14.5C34.5 12 32 12 32 12Z" fill="#FBBF24" />
            </svg>
          </div>

          <h1 className="brand-heading" id="register-title" style={{ fontSize: '2.5rem', fontWeight: '800', color: (isTransitioning || pendingVerification) ? '#ffffff' : '#a5b4fc', whiteSpace: 'nowrap', margin: '0' }}>
            {(isTransitioning || pendingVerification) ? 'Create Account' : 'Welcome to Hexa Laundry'}
          </h1>
          
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginTop: '8px', marginBottom: '4px' }}>
            Start your Hexa Laundry journey
          </p>

          {!pendingVerification && !isTransitioning && (
            <p style={{ color: '#18A7FF', fontSize: '1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>
              Shopkeeper Panel
            </p>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '430px' }}>
          
          <div style={{
            boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.95)',
            border: '1px solid #1c1c1f',
            borderRadius: '16px',
            width: '100%',
            padding: '40px 32px',
            backgroundColor: '#0a0a0c',
            fontFamily: 'sans-serif',
            minHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>

            {error && !isTransitioning && (
              <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>
                {error}
              </div>
            )}

            {/* STATE 1: Intermediate Loading Transition */}
            {isTransitioning ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: '16px' }}>
                <h2 style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: '600', margin: 0 }}>Create your account</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, textAlign: 'center' }}>Welcome! Please fill in the details to get started.</p>
                <div style={{ width: '28px', height: '28px', border: '3px solid #1c1c1f', borderTopColor: '#18A7FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginTop: '12px' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : !pendingVerification ? (
              
              /* STATE 2: Primary Custom Signup Form Layout */
              <>
                <h2 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: '600', textAlign: 'center', margin: '0 0 8px 0' }}>Sign Up</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', margin: '0 0 24px 0' }}>Create your shopkeeper account</p>

                <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', marginBottom: '20px', width: '100%' }}>
                  <button type="button" disabled={loading} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#121214', border: '1px solid #1c1c1f', color: '#ffffff', padding: '10px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3A11.932 11.932 0 0 0 12 0C7.305 0 3.264 2.559 1.09 6.382l4.176 3.383z"/><path fill="#4285F4" d="M23.455 12.273c0-.818-.073-1.609-.209-2.373H12v4.509h6.427a5.493 5.493 0 0 1-2.382 3.6 l4.136 3.209c2.418-2.227 3.81-5.509 3.81-9.945z"/><path fill="#FBBC05" d="M5.266 14.235A7.076 7.076 0 0 1 4.727 12c0-.79.132-1.55.373-2.265L.923 6.352A11.947 11.947 0 0 0 0 12c0 2.082.532 4.045 1.473 5.773l3.793-3.538z"/><path fill="#34A853" d="M12 24c3.245 0 5.973-1.077 7.964-2.918l-4.136-3.209c-1.145.768-2.609 1.227-4.418 1.227-3.41 0-6.3-2.309-7.327-5.409l-4.177 3.236A11.936 11.936 0 0 0 12 24z"/></svg>Google</button>
                  <button type="button" disabled={loading} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#121214', border: '1px solid #1c1c1f', color: '#ffffff', padding: '10px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}><svg width="18" height="18" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>Facebook</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#71717a', fontSize: '13px' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#1c1c1f' }} />
                  <span style={{ padding: '0 10px' }}>or</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#1c1c1f' }} />
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div id="clerk-captcha"></div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ color: '#e4e4e7', fontSize: '0.9rem' }}>Shop Name</label>
                    <input type="text" required disabled={loading} value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="e.g. Hexa Laundry Express" style={{ backgroundColor: '#121214', border: '1px solid #1c1c1f', color: '#ffffff', padding: '10px 14px', borderRadius: '6px', fontSize: '0.95rem', outline: 'none' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ color: '#e4e4e7', fontSize: '0.9rem' }}>Email Address</label>
                    <input type="email" required disabled={loading} value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} style={{ backgroundColor: '#121214', border: '1px solid #1c1c1f', color: '#ffffff', padding: '10px 14px', borderRadius: '6px', fontSize: '0.95rem', outline: 'none' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                    <label style={{ color: '#e4e4e7', fontSize: '0.9rem' }}>Password</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                      <input type={showPassword ? "text" : "password"} required disabled={loading} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" style={{ backgroundColor: '#121214', border: `1px solid ${pwdState.color}`, color: '#ffffff', padding: '10px 40px 10px 14px', borderRadius: '6px', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', display: 'flex', alignItems: 'center' }}>
                        {showPassword ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>}
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginTop: '4px', fontSize: '0.85rem', color: pwdState.type === 'empty' || pwdState.type === 'weak' ? '#94a3b8' : pwdState.color }}>
                      {pwdState.type === 'warning' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginTop: '2px', flexShrink: 0 }}><circle cx="12" cy="12" r="10" fill="rgba(234, 88, 12, 0.1)"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>}
                      {pwdState.type === 'strong' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginTop: '2px', flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      <span>{pwdState.text}</span>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} style={{ backgroundColor: '#18A7FF', color: '#ffffff', fontSize: '15px', fontWeight: '600', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '8px' }}>Continue</button>
                </form>
              </>
            ) : (
              
              /* STATE 3: Upgraded Auto-Submit OTP Box Interface + SUCCESS STATUS */
              <form onSubmit={handleVerifyFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', width: '100%' }}>
                  <h2 style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: '600', margin: '0' }}>Verify your email</h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', margin: '6px 0 0 0' }}>Enter the verification code sent to your email</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                    <span style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: '500' }}>{emailAddress}</span>
                    <button type="button" onClick={() => setPendingVerification(false)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#18A7FF', display: 'flex', alignItems: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"></path></svg>
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', width: '100%', marginTop: '10px' }}>
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      disabled={loading || isSuccess}
                      ref={(el) => (inputRefs.current[index] = el)}
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      style={{ 
                        width: '46px', 
                        height: '46px', 
                        backgroundColor: '#121214', 
                        border: isSuccess ? '1px solid #22c55e' : '1px solid #1c1c1f', 
                        color: '#ffffff', 
                        borderRadius: '8px', 
                        textAlign: 'center', 
                        fontSize: '1.2rem', 
                        fontWeight: '600', 
                        outline: 'none', 
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => !isSuccess && (e.target.style.borderColor = '#18A7FF')}
                      onBlur={(e) => !isSuccess && (e.target.style.borderColor = '#1c1c1f')}
                    />
                  ))}
                </div>

                {/* DYNAMIC FOOTER: IMAGE 3 SUCCESS DISPLAY OR TIMER TEXT */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '24px' }}>
                  {isSuccess ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22c55e', fontSize: '0.9rem', fontWeight: '500', animation: 'fadeIn 0.2s ease-out' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Success</span>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.85rem', textAlign: 'center', color: '#94a3b8' }}>
                      {resendTimer > 0 ? <span>Didn't receive a code? Resend ({resendTimer})</span> : <span onClick={handleResendCode} style={{ color: '#18A7FF', cursor: 'pointer', fontWeight: '500' }}>Resend Code</span>}
                    </div>
                  )}
                </div>
                
                <style>{`
                  @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(2px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}</style>

                <button type="submit" disabled={loading || otp.join('').length < 6 || isSuccess} style={{ backgroundColor: isSuccess ? '#22c55e' : '#18A7FF', color: '#ffffff', fontSize: '15px', fontWeight: '600', padding: '12px', border: 'none', borderRadius: '6px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: (loading || otp.join('').length < 6) ? 0.6 : 1, transition: 'background-color 0.2s' }}>
                  {isSuccess ? 'Redirecting...' : loading ? 'Verifying...' : 'Continue'}
                  {!isSuccess && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>}
                </button>
              </form>
            )}

            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
              Already have an account?{' '}
              <span onClick={() => !loading && !isSuccess && navigate('/login')} style={{ color: '#18A7FF', cursor: 'pointer', fontWeight: '500' }}>Sign In</span>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}