"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "../../providers/AuthProviders";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { loginUser, googleLogin, user } = useContext(AuthContext);
  const router = useRouter();
  const axiosPublic = useAxiosPublic();
  const [showPassword, setShowPassword] = useState(false);

  if (user) {
    router.push("/");
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await loginUser(email, password);
      toast.success("Logged in successfully!");
      router.push("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await googleLogin();
      const userInfo = {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      };
      await axiosPublic.post("/users", userInfo);
      toast.success("Logged in with Google!");
      router.push("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-12">
      <div className="w-full max-w-md animate-scale-in rounded-2xl bg-card p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue to Care.xyz
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Enter your password"
                className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Sign In
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border"></div>
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-border py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
