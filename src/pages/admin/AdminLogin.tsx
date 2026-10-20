import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Flame,
  LockKeyhole,
  Mail,
  ShieldCheck,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success || !data?.token) {
        throw new Error(data?.message || "Invalid email or password.");
      }

      // Store the authentication token for subsequent admin API requests.
      sessionStorage.setItem("raja_admin_token", data.token);

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffaf2] px-4 py-10 text-[#251714]">
      <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[#ead9c4] opacity-50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#d8b5a0] opacity-30 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#eadfce] bg-white shadow-2xl lg:grid-cols-2">
        {/* Branding panel */}
        <section className="relative flex min-h-64 flex-col justify-between overflow-hidden bg-[#4a1018] p-8 text-white sm:p-12 lg:min-h-[620px]">
          <div className="absolute -right-20 top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -right-10 top-30 h-44 w-44 rounded-full border border-white/10" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full border border-white/10" />

          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
              <Flame size={30} />
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-[#e8c8a1]">
              Sivakasi Fireworks
            </p>

            <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
              Raja
              <br />
              Agencies
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/75 sm:text-base">
              Manage your products, product images and customer order enquiries
              from one secure workspace.
            </p>
          </div>

          <div className="relative mt-10 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-4">
            <ShieldCheck className="shrink-0 text-[#e8c8a1]" size={25} />
            <div>
              <p className="text-sm font-bold">Administrator access</p>
              <p className="mt-1 text-xs text-white/60">
                For authorized store administrators only
              </p>
            </div>
          </div>
        </section>

        {/* Login form */}
        <section className="flex items-center justify-center p-6 sm:p-12 lg:p-14">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f7eee5] px-3 py-1.5 text-xs font-bold text-[#4a1018]">
                <LockKeyhole size={14} />
                SECURE ADMIN PORTAL
              </span>

              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Sign in with your administrator credentials to continue.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle size={19} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-2 block text-sm font-bold"
                >
                  Email address
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[#eadfce] bg-white px-4 transition focus-within:border-[#4a1018] focus-within:ring-4 focus-within:ring-[#4a1018]/5">
                  <Mail size={18} className="shrink-0 text-gray-400" />

                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@example.com"
                    required
                    maxLength={254}
                    className="min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="admin-password"
                    className="text-sm font-bold"
                  >
                    Password
                  </label>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-[#eadfce] bg-white px-4 transition focus-within:border-[#4a1018] focus-within:ring-4 focus-within:ring-[#4a1018]/5">
                  <LockKeyhole
                    size={18}
                    className="shrink-0 text-gray-400"
                  />

                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    maxLength={128}
                    className="min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="shrink-0 text-gray-400 hover:text-[#4a1018]"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4a1018] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-[#4a1018]/15 transition hover:bg-[#641722] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin" size={18} />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to dashboard
                    <LockKeyhole size={17} />
                  </>
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#eadfce]" />
              <span className="text-xs text-gray-400">RAJA AGENCIES</span>
              <div className="h-px flex-1 bg-[#eadfce]" />
            </div>

            <p className="text-center text-xs leading-6 text-gray-500">
              Authorized administrators only. If you need access, contact the
              store owner.
            </p>

            <Link
              to="/"
              className="mt-6 block text-center text-sm font-bold text-[#4a1018] hover:underline"
            >
              ← Back to store
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
