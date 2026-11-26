import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { BudiButton, BudiCard, SimulationBanner } from '../../components/ui/DesignSystem';
import { BudiIcon } from '../../components/icons/BudiIcon';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth.service';

/**
 * AuthLayout wraps Login, Registration, Forgot Password, Reset Password, and Email Verification.
 * Uses selective GSAP entrance animation on the left brand showcase panel (never mixed with Framer Motion on the same element).
 */
const AuthShell: React.FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => {
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-hero-item',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power2.out' }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col lg:flex-row">
      {/* Left Brand Panel (Selective GSAP animation) */}
      <div
        ref={heroRef}
        className="lg:w-5/12 bg-[#111D30] text-white p-8 lg:p-12 flex flex-col justify-between"
      >
        <div className="gsap-hero-item flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FC5050] text-white font-extrabold text-xl">
            B
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight">Budipoint</span>
            <span className="block text-[11px] font-semibold uppercase tracking-widest text-[#FC5050]">
              Digital Services & Fintech
            </span>
          </div>
        </div>

        <div className="my-10 space-y-5">
          <span className="gsap-hero-item inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold text-[#FC5050]">
            Modular API-First Architecture
          </span>
          <h1 className="gsap-hero-item text-3xl lg:text-4xl font-extrabold leading-tight">
            One platform for Telecom, Utility Bills, eSIMs, Gift Cards & Virtual Cards.
          </h1>
          <p className="gsap-hero-item text-sm text-white/75 leading-relaxed">
            Built with Laravel Sanctum security, PostgreSQL decimal ledger accuracy, and separated Customer and Administrator environments.
          </p>
        </div>

        <div className="gsap-hero-item rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/80 space-y-1">
          <p className="font-bold text-white">Sandbox Environment Notice</p>
          <p>
            Third-party provider endpoints are currently decoupled. All wallet credits and service orders run against simulated mock repositories.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-md space-y-6">
          <SimulationBanner compact />
          <div>
            <h2 className="text-2xl font-extrabold text-[#111D30]">{title}</h2>
            <p className="mt-1 text-sm text-[#64748B]">{subtitle}</p>
          </div>
          <BudiCard padding="lg">{children}</BudiCard>
        </div>
      </div>
    </div>
  );
};

export const LoginPage: React.FC = () => {
  const { login, switchEnvironmentRole, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('adebayo.ogunlesi@budipoint.ng');
  const [password, setPassword] = useState('Budipoint#2026');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!email.trim() || !password.trim()) {
      setFormError('Please provide both your email address and password.');
      return;
    }
    try {
      const res = await login({ email, password });
      navigate(res.user.role === 'admin' ? '/admin/dashboard' : '/app/dashboard');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Login failed.');
    }
  };

  const handleQuickDemo = async (role: 'customer' | 'admin') => {
    await switchEnvironmentRole(role);
    navigate(role === 'admin' ? '/admin/dashboard' : '/app/dashboard');
  };

  return (
    <AuthShell
      title="Sign in to Budipoint"
      subtitle="Access your customer dashboard or switch to the administrator console."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError && (
          <div className="rounded-xl border border-[#FC5050]/30 bg-[#FC5050]/10 p-3 text-xs font-semibold text-[#FC5050]">
            {formError}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#111D30]">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2.5 text-sm text-[#111D30] focus:border-[#FC5050] focus:bg-white focus:outline-none"
            placeholder="you@budipoint.ng"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111D30]">
              Password
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-xs font-semibold text-[#FC5050] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2.5 text-sm text-[#111D30] focus:border-[#FC5050] focus:bg-white focus:outline-none"
          />
        </div>

        <BudiButton type="submit" isLoading={isLoading} className="w-full">
          Sign In
        </BudiButton>

        <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] text-center">
            Instant Sandbox Environment Preview
          </p>
          <div className="grid grid-cols-2 gap-2">
            <BudiButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void handleQuickDemo('customer')}
            >
              Customer Portal
            </BudiButton>
            <BudiButton
              type="button"
              variant="navy"
              size="sm"
              onClick={() => void handleQuickDemo('admin')}
            >
              Admin Console
            </BudiButton>
          </div>
        </div>

        <p className="text-center text-xs text-[#64748B] pt-2">
          New to Budipoint?{' '}
          <Link to="/auth/register" className="font-bold text-[#FC5050] hover:underline">
            Create a customer account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
};

export const RegisterPage: React.FC = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || !password) {
      setFormError('All registration fields are required.');
      return;
    }
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters.');
      return;
    }
    if (password !== passwordConfirmation) {
      setFormError('Password and Confirm Password do not match.');
      return;
    }

    try {
      await register({
        fullName,
        email,
        phoneNumber,
        password,
        passwordConfirmation,
      });
      navigate('/auth/verify-email');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Registration failed.');
    }
  };

  return (
    <AuthShell
      title="Create Customer Account"
      subtitle="Register for a Budipoint wallet and digital services account."
    >
      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {formError && (
          <div className="rounded-xl border border-[#FC5050]/30 bg-[#FC5050]/10 p-3 text-xs font-semibold text-[#FC5050]">
            {formError}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#111D30]">
            Full Name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Adebayo Ogunlesi"
            className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2.5 text-sm text-[#111D30] focus:border-[#FC5050] focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#111D30]">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="adebayo@example.ng"
            className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2.5 text-sm text-[#111D30] focus:border-[#FC5050] focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#111D30]">
            Phone Number
          </label>
          <input
            type="tel"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+234 803 000 0000"
            className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2.5 text-sm text-[#111D30] focus:border-[#FC5050] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111D30]">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2.5 text-sm text-[#111D30] focus:border-[#FC5050] focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111D30]">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2.5 text-sm text-[#111D30] focus:border-[#FC5050] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <BudiButton type="submit" isLoading={isLoading} className="w-full">
          Register Account
        </BudiButton>

        <p className="text-center text-xs text-[#64748B] pt-2">
          Already registered?{' '}
          <Link to="/auth/login" className="font-bold text-[#FC5050] hover:underline">
            Sign in here
          </Link>
        </p>
      </form>
    </AuthShell>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      const msg = await authService.forgotPassword({ email });
      setStatusMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Forgot Password"
      subtitle="Enter your registered email to receive a password reset token."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {statusMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
            {statusMessage}
          </div>
        )}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#111D30]">
            Registered Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@budipoint.ng"
            className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2.5 text-sm text-[#111D30] focus:border-[#FC5050] focus:bg-white focus:outline-none"
          />
        </div>
        <BudiButton type="submit" isLoading={isSubmitting} className="w-full">
          Send Reset Link
        </BudiButton>
        <div className="flex justify-between text-xs pt-2">
          <Link to="/auth/login" className="font-bold text-[#111D30] hover:underline">
            Back to Sign In
          </Link>
          <Link to="/auth/reset-password" className="font-bold text-[#FC5050] hover:underline">
            Have a reset token?
          </Link>
        </div>
      </form>
    </AuthShell>
  );
};

export const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('SIM-RESET-TOKEN-2026');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const msg = await authService.resetPassword({
        token,
        email,
        password,
        passwordConfirmation,
      });
      setFeedback(msg);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset password.');
    }
  };

  return (
    <AuthShell
      title="Reset Account Password"
      subtitle="Provide your reset token and choose a new password."
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {error && (
          <div className="rounded-xl border border-[#FC5050]/30 bg-[#FC5050]/10 p-3 text-xs font-semibold text-[#FC5050]">
            {error}
          </div>
        )}
        {feedback && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
            {feedback}
          </div>
        )}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#111D30]">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#111D30]">
            Reset Token
          </label>
          <input
            type="text"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#111D30]">
            New Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#111D30]">
            Confirm New Password
          </label>
          <input
            type="password"
            required
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2 text-sm"
          />
        </div>
        <BudiButton type="submit" className="w-full">
          Update Password
        </BudiButton>
        <p className="text-center text-xs pt-2">
          <Link to="/auth/login" className="font-bold text-[#FC5050] hover:underline">
            Return to Sign In
          </Link>
        </p>
      </form>
    </AuthShell>
  );
};

export const VerifyEmailPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resent, setResent] = useState(false);

  return (
    <AuthShell
      title="Verify Your Email Address"
      subtitle="Laravel Sanctum email verification checkpoint."
    >
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FC5050]/10 text-[#FC5050]">
          <BudiIcon name="shield" size={24} active />
        </div>
        <p className="text-sm text-[#111D30]">
          A verification message has been queued for{' '}
          <span className="font-bold">{user?.email ?? 'your email address'}</span>.
        </p>
        {resent && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800">
            [SIMULATED] Verification link re-sent in sandbox mode.
          </div>
        )}
        <div className="flex flex-col gap-2 pt-2">
          <BudiButton onClick={() => navigate('/app/dashboard')} className="w-full">
            Continue to Customer Dashboard
          </BudiButton>
          <BudiButton
            variant="outline"
            onClick={() => setResent(true)}
            className="w-full"
          >
            Resend Verification Email
          </BudiButton>
        </div>
      </div>
    </AuthShell>
  );
};
