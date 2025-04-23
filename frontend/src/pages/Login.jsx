// Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../App";     // adjust path as needed
import { Heart } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { login, checkSession } = useContext(AuthContext);

  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs = { username: "", password: "" };
    if (!form.username.trim()) errs.username = "Username is required";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return !errs.username && !errs.password;
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const contentType = res.headers.get("content-type") || "";
      let data = {};

      if (!res.ok) {
        // Try to extract a JSON error message, otherwise read text
        let errMsg;
        if (contentType.includes("application/json")) {
          const errData = await res.json();
          errMsg = errData.message;
        } else {
          errMsg = await res.text();
        }
        throw new Error(errMsg || "Login failed");
      }

      // Only parse JSON if it’s actually JSON
      if (contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!data.user) {
        throw new Error("No user data returned from server");
      }

      // Update context & re-check session
      login(data.user, data.organization);
      await checkSession();

      toast.success(`Welcome back, ${data.user.name}!`);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "Invalid credentials, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex absolute w-full   top-0 z-0 items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
            <Heart className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold">Welcome to FoodShare</h2>
          <p className="text-gray-600 text-sm">Enter your credentials below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-900 font-semibold mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-white focus:outline-none focus:ring focus:ring-red-500"
              placeholder="Your username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-900 font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-red-500"
              placeholder="Your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-red-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
