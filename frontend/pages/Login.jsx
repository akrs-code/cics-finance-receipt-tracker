import { useState, useEffect } from "react"; // Added useEffect
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login, user } = useAuth(); // Assuming 'user' holds the session
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  if (user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] font-inter antialiased">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-100 bg-[#111111] border border-neutral-800 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-24 w-24 object-contain -mt-20 mb-4"
          />
          <h2 className="text-xl font-semibold text-white tracking-tight uppercase">RECEIPT TRACKER</h2>
          <p className="text-xs text-neutral-500 mt-1">Enter your credentials to continue</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              required
              autoComplete="email"
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-neutral-800 rounded-lg text-white text-sm placeholder:text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500 transition-all"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full px-4 py-2.5 pr-11 bg-[#0a0a0a] border border-neutral-800 rounded-lg text-white text-sm placeholder:text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500 transition-all"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-medium text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-8 bg-white text-black py-2.5 rounded-lg font-bold text-sm hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Authenticating...
            </>
          ) : (
            "Login to Dashboard"
          )}
        </button>

        <div className="mt-8 text-center border-t border-neutral-800 pt-6">
          <p className="text-[10px] text-neutral-600 font-medium uppercase tracking-widest">
            Authorized Officers Only
          </p>
        </div>
      </form>
    </div>
  );
}