"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "../../providers/AuthProviders";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { FcGoogle } from "react-icons/fc";
import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiCreditCard,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const { createUser, updateUserProfile, googleLogin, user } =
    useContext(AuthContext);
  const router = useRouter();
  const axiosPublic = useAxiosPublic();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  if (user) {
    router.push("/");
    return null;
  }

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least 1 uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least 1 lowercase letter";
    }
    return "";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const nid = form.nid.value;
    const name = form.name.value;
    const email = form.email.value;
    const contact = form.contact.value;
    const password = form.password.value;

    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      toast.error(error);
      return;
    }
    setPasswordError("");

    try {
      await createUser(email, password);
      await updateUserProfile(name, "");
      await axiosPublic.post("/users", { nid, name, email, contact });
      toast.success("Registration successful!");
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
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join Care.xyz and start booking services
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">NID No</label>
            <div className="relative">
              <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" name="nid" required placeholder="Enter your NID number" className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" name="name" required placeholder="Enter your full name" className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="email" name="email" required placeholder="Enter your email" className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Contact Number</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="tel" name="contact" required placeholder="Enter your phone number" className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Create a password"
                className={`w-full rounded-lg border bg-card py-2.5 pl-10 pr-10 text-sm outline-none transition-colors focus:ring-1 ${
                  passwordError
                    ? "border-danger focus:border-danger focus:ring-danger"
                    : "border-border focus:border-primary focus:ring-primary"
                }`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {passwordError && <p className="mt-1 text-xs text-danger">{passwordError}</p>}
            <p className="mt-1 text-xs text-muted-foreground">Min 6 characters, 1 uppercase, 1 lowercase</p>
          </div>

          <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
            Create Account
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border"></div>
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border"></div>
        </div>

        <button onClick={handleGoogleLogin} className="flex w-full items-center justify-center gap-3 rounded-lg border border-border py-2.5 text-sm font-medium transition-colors hover:bg-muted">
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
