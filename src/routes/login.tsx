import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useAuth } from "@/context/auth-context";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login - YourBuildMart" }] }),
  component: LoginPage,
});

type Mode = "otp" | "password" | "forgot";
type Step = "identifier" | "verify" | "reset";

function LoginPage() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    loginWithPassword,
    requestLoginOtp,
    loginWithOtp,
    requestForgotPasswordOtp,
    resetForgottenPassword,
  } = useAuth();
  const [mode, setMode] = useState<Mode>("otp");
  const [step, setStep] = useState<Step>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const returnTo = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("returnTo")
    : null;

  useEffect(() => {
    if (isAuthenticated) {
      void navigate({
        to: returnTo === "/checkout/shipping" ? "/checkout/shipping" : "/profile",
        replace: true,
      });
    }
  }, [isAuthenticated, navigate, returnTo]);

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode);
    setStep("identifier");
    setOtp("");
    setError("");
    setMessage("");
  };

  const sendOtp = async () => {
    const result = mode === "forgot"
      ? await requestForgotPasswordOtp(identifier.trim())
      : await requestLoginOtp(identifier.trim());
    setOtp("");
    setDestination(result.challenge.maskedDestination || identifier.trim());
    setStep("verify");
    setMessage(`OTP sent to ${result.challenge.maskedDestination || identifier.trim()}.`);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const form = new FormData(event.currentTarget);

    try {
      if (mode === "password") {
        await loginWithPassword(identifier.trim(), String(form.get("password")));
        await navigate({ to: returnTo === "/checkout/shipping" ? "/checkout/shipping" : "/profile" });
      } else if (step === "identifier") {
        await sendOtp();
      } else if (mode === "otp") {
        await loginWithOtp(identifier.trim(), otp.trim());
        await navigate({ to: returnTo === "/checkout/shipping" ? "/checkout/shipping" : "/profile" });
      } else if (step === "verify") {
        setStep("reset");
        setMessage("Enter your new password to complete the OTP reset.");
      } else {
        const password = String(form.get("newPassword"));
        const confirmation = String(form.get("confirmPassword"));
        if (password !== confirmation) throw new Error("Passwords do not match.");
        await resetForgottenPassword(identifier.trim(), otp.trim(), password);
        changeMode("password");
        setMessage("Password reset. You can now log in.");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-[--peach] to-background">
      <Navbar />
      <main className="container-page flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          <h1 className="text-3xl">
            {mode === "forgot" ? "Reset Password" : "Login"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "otp"
              ? "Enter your mobile number to continue with OTP."
              : mode === "password"
                ? "Returning customers can use their mobile number and password."
                : "We will send an OTP to your registered mobile number."}
          </p>

          {mode !== "forgot" ? (
            <div className="mt-6 flex rounded-full bg-secondary p-1">
              <button
                type="button"
                onClick={() => changeMode("otp")}
                className={`flex-1 rounded-full py-2 text-sm ${mode === "otp" ? "bg-brand text-white" : ""}`}
              >
                Login with OTP
              </button>
              <button
                type="button"
                onClick={() => changeMode("password")}
                className={`flex-1 rounded-full py-2 text-sm ${mode === "password" ? "bg-brand text-white" : ""}`}
              >
                Use Password
              </button>
            </div>
          ) : null}

          <form onSubmit={submit} className="mt-5 space-y-4">
            <Field
              label="Mobile Number"
              value={identifier}
              onChange={setIdentifier}
              disabled={step !== "identifier"}
              autoComplete="tel"
              inputMode="tel"
            />

            {mode === "password" ? (
              <Field
                name="password"
                label="Password"
                type="password"
                minLength={8}
                autoComplete="current-password"
              />
            ) : null}

            {step === "verify" || step === "reset" ? (
              <Field
                label="OTP"
                value={otp}
                onChange={setOtp}
                inputMode="numeric"
                autoComplete="one-time-code"
                disabled={step === "reset"}
              />
            ) : null}

            {mode === "forgot" && step === "reset" ? (
              <>
                <Field name="newPassword" label="New Password" type="password" minLength={8} autoComplete="new-password" />
                <Field name="confirmPassword" label="Confirm Password" type="password" minLength={8} autoComplete="new-password" />
              </>
            ) : null}

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {message ? <p className="text-sm text-brand">{message}</p> : null}

            <button
              disabled={loading}
              className="w-full rounded-full bg-orange py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : mode === "password"
                  ? "Login"
                  : step === "identifier"
                    ? "Send OTP"
                    : mode === "otp"
                      ? "Verify and Continue"
                      : step === "verify"
                        ? "Continue"
                        : "Reset Password"}
            </button>
          </form>

          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            {mode === "forgot" ? (
              <button type="button" onClick={() => changeMode("password")} className="text-brand">
                Back to login
              </button>
            ) : (
              <button type="button" onClick={() => changeMode("forgot")} className="text-brand">
                Forgot password?
              </button>
            )}
            {(step === "verify" && mode !== "password") ? (
              <button type="button" disabled={loading} onClick={() => void sendOtp()} className="text-brand disabled:opacity-50">
                Resend OTP
              </button>
            ) : null}
          </div>

          <Link to="/products" className="mt-4 block text-center text-sm text-brand">
            Continue browsing products
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  value,
  onChange,
  disabled,
  minLength,
  inputMode,
  autoComplete,
}: {
  name?: string;
  label: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  minLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && visible ? "text" : type;

  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium">{label}</span>
      <span className="relative block">
        <input
          name={name}
          type={inputType}
          required
          value={value}
          onChange={onChange ? (event) => onChange(event.target.value) : undefined}
          disabled={disabled}
          minLength={minLength}
          inputMode={inputMode}
          autoComplete={autoComplete}
          className={`h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-70 ${isPassword ? "pr-11" : ""}`}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-brand"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        ) : null}
      </span>
    </label>
  );
}
