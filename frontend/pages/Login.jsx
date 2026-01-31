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
    <div className='min-h-screen flex items-center justify-center bg-neutral-900'>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-card rounded-2xl shadow-xl p-10"
      >
       <img src="/logo.png" alt="Logo" className="h-24 w-24 mx-auto -mt-20" />
        <div className="mb-4">
          <label className="block text-xs font-bold font-inter mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            required
            className="w-full px-4 py-2 rounded-xl font-inter shadow-card text-sm"
            onChange={handleChange}
            />
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold font-inter mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="*********"
            required
            className="w-full px-4 py-2 rounded-xl font-inter shadow-card text-sm"
            onChange={handleChange}
            />
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-2 font-inter text-sm text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-button px-4 py-2 rounded-xl font-inter text-white shadow-card font-bold hover:opacity-90 text-sm disabled:opacity-50 "
          >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
