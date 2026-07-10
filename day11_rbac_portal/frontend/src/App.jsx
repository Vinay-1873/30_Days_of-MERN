import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { useState } from 'react';

// --- Tailwind Login Component ---
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/20 bg-slate-950/70 shadow-[0_30px_120px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative overflow-hidden p-8 sm:p-12 lg:p-14">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/15 via-sky-400/10 to-transparent" />
          <div className="absolute -right-16 top-12 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute -bottom-20 left-12 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="relative max-w-xl">
            <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
              RBAC Secure Portal
            </span>
            <h1 className="mt-6 max-w-lg text-4xl font-black tracking-tight text-white sm:text-5xl">
              Sign in to a cleaner, controlled access experience.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
              Authenticate with your backend account, review your clearance level, and open the dashboard from a polished control panel.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/70">Access</p>
                <p className="mt-2 text-lg font-semibold text-white">Role-aware routing</p>
                <p className="mt-2 text-sm text-slate-300">Protected dashboard access based on stored user role.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/70">Session</p>
                <p className="mt-2 text-lg font-semibold text-white">Token persistence</p>
                <p className="mt-2 text-sm text-slate-300">Your JWT is saved locally for smooth refreshes.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/96 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
          <div className="mx-auto flex w-full max-w-md flex-col">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight text-slate-950">Portal Login</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Use your account credentials to enter the secure dashboard.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="john@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/15"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/15"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Authenticating...' : 'Sign in to dashboard'}
              </button>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
                >
                  Create account
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-2xl bg-cyan-50 px-4 py-3.5 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-100"
                >
                  Sign up now
                </Link>
              </div>
            </form>

            <p className="mt-6 text-center text-xs leading-5 text-slate-500">
              Demo account: john@example.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Signup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(name.trim(), email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed. Please review the form and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/20 bg-slate-950/70 shadow-[0_30px_120px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border-b border-white/10 bg-white/96 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div className="mx-auto flex w-full max-w-md flex-col">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight text-slate-950">Create account</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Register once and use the same secure dashboard flow.</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Full name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/15"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/15"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/15"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>

              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
              >
                Back to login
              </Link>
            </form>
          </div>
        </div>

        <div className="relative overflow-hidden p-8 sm:p-12 lg:p-14">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/15 via-sky-400/10 to-transparent" />
          <div className="absolute -left-16 top-12 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute -bottom-20 right-12 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="relative max-w-xl">
            <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
              New user onboarding
            </span>
            <h1 className="mt-6 max-w-lg text-4xl font-black tracking-tight text-white sm:text-5xl">
              Build your account and enter the secure workspace.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
              Create a profile, receive a token, and move directly into the dashboard with the same RBAC flow as login.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/70">Fast start</p>
                <p className="mt-2 text-lg font-semibold text-white">No separate onboarding step</p>
                <p className="mt-2 text-sm text-slate-300">Your new account is logged in immediately after registration.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/70">Security</p>
                <p className="mt-2 text-lg font-semibold text-white">JWT-backed sessions</p>
                <p className="mt-2 text-sm text-slate-300">The backend returns the token and role used by protected routes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Tailwind Unauthorized Component ---
const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center px-4 py-10">
    <div className="max-w-lg rounded-[2rem] border border-rose-200 bg-white p-8 text-center shadow-[0_24px_90px_rgba(15,23,42,0.12)]">
      <h2 className="text-3xl font-black text-rose-600 mb-2">403 - Access Denied</h2>
      <p className="text-slate-600 mb-6">You do not have the required security clearance to view this sector.</p>
      <Link 
        to="/dashboard" 
        className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-2.5 font-semibold text-white transition hover:bg-slate-800"
      >
        Return to Safety
      </Link>
    </div>
  </div>
);

// --- Tailwind Dashboard Component ---
const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/20 bg-white/90 p-6 shadow-[0_24px_120px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 border-b border-slate-200/80 pb-6 mb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700">Secure dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Welcome, {user.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              Clearance Level: 
              <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                user.role === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-cyan-100 text-cyan-700'
              }`}>
                {user.role}
              </span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* ADMIN EXCLUSIVE PANEL */}
        {user.role === 'admin' && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6">
            <h3 className="text-xl font-bold text-rose-800 mb-2">Admin Control Center</h3>
            <p className="text-rose-900/80 mb-4 text-sm">This restricted module is completely invisible to standard users.</p>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700">Purge Logs</button>
              <button className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700">Manage Roles</button>
            </div>
          </div>
        )}

        {/* STANDARD USER PANEL */}
        <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-6">
          <h3 className="text-xl font-bold text-cyan-900 mb-2">Standard User Operations</h3>
          <p className="text-cyan-900/80 text-sm mb-4">All authenticated personnel have access to this data.</p>
          <ul className="space-y-3 text-sm text-cyan-900/75">
            <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-cyan-500" /> View personal profile</li>
            <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-cyan-500" /> Submit daily reports</li>
            <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-cyan-500" /> Access public company directory</li>
          </ul>
        </div>
        </div>

      </div>
    </div>
  );
};

// --- Main Application Router ---
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <nav className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/75 px-4 py-4 text-white backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/80">RBAC Portal</p>
              <p className="mt-1 text-sm text-slate-300">Secure access interface</p>
            </div>
            <div className="flex gap-2 sm:gap-4">
              <Link to="/login" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10">Login</Link>
              <Link to="/dashboard" className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">Dashboard</Link>
            </div>
          </div>
        </nav>

        <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;