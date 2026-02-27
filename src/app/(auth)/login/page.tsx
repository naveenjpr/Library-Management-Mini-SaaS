"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordshow, setPasswordshow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (!data.session) {
        setError("Login failed. No session returned.");
        setLoading(false);
        return;
      }

      if (data.user) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-secondary-medium dark:bg-gray-950 p-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 p-8 rounded-base shadow-xl border border-default-medium dark:border-gray-800">
        <h2 className="text-2xl font-bold text-center mb-6 text-heading dark:text-white">Sign In</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-base text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email-alternative" className="block mb-2.5 text-sm font-medium text-heading dark:text-gray-300">Your email</label>
            <input
              type="email"
              id="email-alternative"
              className="bg-neutral-secondary-medium dark:bg-gray-800 border border-default-medium dark:border-gray-700 text-heading dark:text-white text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow placeholder:text-body"
              placeholder="name@flowbite.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password-alternative" className="block mb-2.5 text-sm font-medium text-heading dark:text-gray-300">Your password</label>

            <div className="relative">

              <input
                type={passwordshow ? "text" : "password"}
                id="password-alternative"
                className="bg-neutral-secondary-medium dark:bg-gray-800 border border-default-medium dark:border-gray-700 text-heading dark:text-white text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow placeholder:text-body"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setPasswordshow(!passwordshow)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                {passwordshow ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5 text-fg-brand">
              <input
                id="remember-alternative"
                type="checkbox"
                className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft accent-brand"
                required
              />
            </div>
            <label htmlFor="remember-alternative" className="ms-2 text-sm font-medium text-heading dark:text-gray-300 select-none">
              I agree with the <a href="#" className="text-fg-brand hover:underline font-semibold">terms and conditions</a>.
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none transition-all disabled:opacity-50 flex justify-center items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : "Submit"}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-body dark:text-gray-400">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="text-fg-brand font-semibold hover:underline"
              >
                Create one
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
