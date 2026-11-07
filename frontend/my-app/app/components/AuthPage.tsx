"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import api from "../lib/axios"
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Router,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

type AuthPageProps = { mode: "login" | "register" };

export default function AuthPage({ mode }: AuthPageProps) {
  const isRegister = mode === "register";
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();


  // Handle the Submit Butto
  async function handleSubmit (event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try{
      if(isRegister){
    const formData = new FormData(event.currentTarget);

    const name = formData.get("name")
    const email = formData.get("email")
    const password = formData.get("password")

    console.log({name, email, password})

    const payload = {
      name,
      email,
      password
    }
    const sendData = await api.post("/register",payload)
    console.log(sendData.data)

    setMessage(sendData.data.message)
  }else{
    // event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")
    const password = formData.get("password")

    const payload = {
      email,
      password
    }

    const sendLoginData = await api.post("/login",payload)
    console.log(sendLoginData.data)
    router.push("/dashboard");

    // Store JWT Token
    localStorage.setItem("token",sendLoginData.data.token)
  }
    }catch(err){
      console.log("Form Error")
    }
  }

  return (
    <main className="auth-page bg-grid">
      <div className="auth-orb auth-orb-one" aria-hidden="true" />
      <div className="auth-orb auth-orb-two" aria-hidden="true" />
      <header className="auth-header">
        <Link className="auth-brand" href="/" aria-label="RedSun home">
          <Image
            src="/redsun-gradient-orbit-logo.png"
            alt="RedSun"
            width={78}
            height={52}
            priority
          />
        </Link>
        <Link className="auth-back-link" href="/">
          Back to home <ArrowRight size={15} />
        </Link>
      </header>

      <section className="auth-layout" aria-labelledby="auth-title">
        <div className="auth-aside">
          <span className="auth-eyebrow">
            <span /> YOUR NEXT CHAPTER STARTS HERE
          </span>
          <h1>
            Clarity for
            <br />
            what comes <em>next.</em>
          </h1>
          <p>
            Bring your work into focus. Sign in to pick up where you left off,
            or create an account to get started.
          </p>
          <div className="auth-note">
            <div className="auth-note-icon">✳</div>
            <div>
              <strong>One clear view.</strong>
              <span>Your insights, all in one place.</span>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <span className="auth-card-kicker">
              {isRegister ? "GET STARTED" : "WELCOME BACK"}
            </span>
            <h2 id="auth-title">
              {isRegister ? "Create your account" : "Sign in to RedSun"}
            </h2>
            <p>
              {isRegister
                ? "A clearer way to move forward starts here."
                : "Enter your details to access your workspace."}
            </p>
          </div>



          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <label className="auth-field">
                <span>Full name</span>
                <div className="auth-input-wrap">
                  <UserRound size={17} />
                  <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    onChange={(e)=> console.log(e.target.value) }
                  />
                </div>
              </label>
            )}
            <label className="auth-field">
              <span>Email address</span>
              <div className="auth-input-wrap">
                <Mail size={17} />
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>
            <label className="auth-field">
              <span>Password</span>
              <div className="auth-input-wrap">
                <LockKeyhole size={17} />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    isRegister ? "Create a password" : "Enter your password"
                  }
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  minLength={8}
                  required
                />
                <button
                  className="auth-password-toggle"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>
            {isRegister ? (
              <label className="auth-check">
                <input type="checkbox" required />
                <span>
                  I agree to the <a href="#terms">Terms of Service</a> and{" "}
                  <a href="#privacy">Privacy Policy</a>.
                </span>
              </label>
            ) : (
              <div className="auth-form-options">
                <label className="auth-check">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#forgot-password">Forgot password?</a>
              </div>
            )}
            <button className="auth-submit" type="submit">
              {isRegister ? "Create account" : "Sign in"}
              <ArrowRight size={17} />
            </button>
            {message && (
              <p className="auth-message" role="status">
                {message}
              </p>
            )}
          </form>

          <div className="auth-switch">
            {isRegister ? "Already have an account?" : "New to RedSun?"}{" "}
            <Link href={isRegister ? "/login" : "/register"}>
              {isRegister ? "Sign in" : "Create an account"}
            </Link>
          </div>
          <div className="auth-card-footer">
            <Image
              src="/redsun-gradient-orbit-logo.png"
              alt="RedSun"
              width={54}
              height={36}
            />{" "}
            <small>Thoughtful tools. Clearer decisions.</small>
          </div>
        </div>
      </section>
      <footer className="auth-legal">
        <span>© 2026 RedSun</span>
        <span>Made for a clearer way forward</span>
      </footer>
    </main>
  );
}
