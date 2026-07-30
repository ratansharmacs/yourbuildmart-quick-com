import { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { api, PINCODE_STORAGE_KEY } from "@/lib/api";

type PincodeContextValue = {
  pincode: string;
  changePincode: () => void;
};

const PincodeContext = createContext<PincodeContextValue | null>(null);

export function PincodeProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [pincode, setPincode] = useState("");
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(PINCODE_STORAGE_KEY) || "";
    if (/^\d{6}$/.test(saved)) {
      setPincode(saved);
      setDraft(saved);
    } else if (saved) {
      window.localStorage.removeItem(PINCODE_STORAGE_KEY);
    }
    setReady(true);
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = draft.trim();
    if (!/^\d{6}$/.test(value)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }
    setValidating(true);
    try {
      const result = await api.validatePincode(value);
      if (!result.serviceable) {
        setError(result.message || "Delivery is not available for this pincode.");
        return;
      }
    } catch (validationError) {
      setError(
        validationError instanceof Error
          ? validationError.message
          : "Unable to validate pincode",
      );
      return;
    } finally {
      setValidating(false);
    }
    window.localStorage.setItem(PINCODE_STORAGE_KEY, value);
    setPincode(value);
    setError("");
    void queryClient.invalidateQueries();
  };

  return (
    <PincodeContext.Provider
      value={{
        pincode,
        changePincode: () => {
          setDraft(pincode);
          setPincode("");
          setError("");
        },
      }}
    >
      {children}
      {ready && !pincode ? (
        <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/55 px-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pincode-title"
            className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
          >
            <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-orange/10">
              <MapPin className="h-7 w-7 text-orange" />
            </div>
            <h1 id="pincode-title" className="text-2xl font-semibold text-foreground">
              Where should we deliver?
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Enter your pincode to see products available for your location.
            </p>
            <form onSubmit={save} className="mt-6">
              <label htmlFor="delivery-pincode" className="text-sm font-medium text-foreground">
                Delivery pincode
              </label>
              <input
                id="delivery-pincode"
                autoFocus
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value.replace(/\D/g, "").slice(0, 6));
                  setError("");
                }}
                placeholder="Enter 6-digit pincode"
                className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-base outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/20"
              />
              {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
              <button
                type="submit"
                disabled={validating}
                className="mt-5 h-12 w-full rounded-xl bg-orange font-semibold text-white transition hover:brightness-95 disabled:cursor-wait disabled:opacity-70"
              >
                {validating ? "Checking…" : "Continue"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </PincodeContext.Provider>
  );
}

export function usePincode() {
  const context = useContext(PincodeContext);
  if (!context) throw new Error("usePincode must be used within PincodeProvider");
  return context;
}
