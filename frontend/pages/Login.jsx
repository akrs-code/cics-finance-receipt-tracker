import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 font-inter">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-button/20 border border-neutral-800 rounded-3xl shadow-card p-10 relative"
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-24 w-24 object-contain filter drop-shadow-2xl" 
          />
        </div>
        
        <div className="mb-4 mt-10">
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1 ml-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            required
            autoComplete="email"
            className="w-full px-4 py-3 rounded-xl bg-button text-white placeholder:text-neutral-600 shadow-card text-sm focus:outline-none focus:ring-1 ring-neutral-500 transition-all"
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1 ml-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="•••••••••"
            required
            autoComplete="current-password"
            className="w-full px-4 py-3 rounded-xl bg-button text-white placeholder:text-neutral-600 shadow-card text-sm focus:outline-none focus:ring-1 ring-neutral-500 transition-all"
            onChange={handleChange}
          />
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-2 text-xs font-bold text-center uppercase tracking-wide">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-card py-3 rounded-xl text-button shadow-card font-bold hover:bg-card/80 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
        >
          {loading ? "Authenticating..." : "Login to System"}
        </button>
        
        <div className="mt-8 text-center">
          <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-tighter">
            Authorized Personnel Only
          </p>
        </div>
      </form>
    </div>
  );
}