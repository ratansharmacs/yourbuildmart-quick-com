import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Footer, Newsletter } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useAuth } from "@/context/auth-context";
import {
  api,
  findDevelopmentOtp,
  type AddressRequest,
  type CustomerProfile,
} from "@/lib/api";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Account - YourBuildMart" }] }),
  component: ProfilePage,
});

const emptyAddress: AddressRequest = {
  addressType: "SHIPPING",
  contactName: "",
  mobile: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  countryId: undefined,
  isDefault: false,
};

function ProfilePage() {
  const { isAuthenticated, user, logout } = useAuth();
  const queryClient = useQueryClient();
  const profile = useQuery({ queryKey: ["profile"], queryFn: api.profile, enabled: isAuthenticated });
  const addresses = useQuery({ queryKey: ["addresses"], queryFn: api.addresses, enabled: isAuthenticated });
  const orders = useQuery({ queryKey: ["orders"], queryFn: () => api.orders({ page: 0, size: 20 }), enabled: isAuthenticated });
  const [address, setAddress] = useState<AddressRequest>(emptyAddress);
  const [message, setMessage] = useState("");

  const createAddress = useMutation({
    mutationFn: api.createAddress,
    onSuccess: async () => {
      setAddress(emptyAddress);
      setMessage("Address saved.");
      await queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error) => setMessage(error.message),
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container-page py-16 text-center">
          <h1 className="text-4xl">Login to view your account</h1>
          <Link to="/login" className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-white">Login</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container-page py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-4xl">My Account</h1>
            <p className="mt-1 text-sm text-muted-foreground">{profile.data?.email || user?.username}</p>
          </div>
          <button onClick={logout} className="rounded-full border border-border px-4 py-2 text-sm">Logout</button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <AccountForm profile={profile.data} onSaved={() => queryClient.invalidateQueries({ queryKey: ["profile"] })} />

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-2xl">Saved Addresses</h2>
            <div className="mt-4 space-y-3">
              {addresses.data?.map((item) => (
                <div key={item.id} className="rounded-xl border border-border p-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <p className="font-semibold">{item.contactName || item.addressType}{item.isDefault ? " · Default" : ""}</p>
                    <button
                      onClick={async () => {
                        await api.deleteAddress(item.id);
                        await queryClient.invalidateQueries({ queryKey: ["addresses"] });
                      }}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="mt-1 text-muted-foreground">{[item.line1, item.line2, item.city, item.state, item.postalCode].filter(Boolean).join(", ")}</p>
                </div>
              ))}
              {!addresses.isLoading && !addresses.data?.length ? <p className="text-sm text-muted-foreground">No saved addresses yet.</p> : null}
            </div>

            <form
              onSubmit={(event) => { event.preventDefault(); createAddress.mutate(address); }}
              className="mt-5 grid gap-3 md:grid-cols-2"
            >
              <AddressInput label="Contact Name" value={address.contactName} onChange={(value) => setAddress({ ...address, contactName: value })} />
              <AddressInput label="Mobile" value={address.mobile} onChange={(value) => setAddress({ ...address, mobile: value })} />
              <AddressInput label="Address Line 1" required value={address.line1} onChange={(value) => setAddress({ ...address, line1: value })} />
              <AddressInput label="Address Line 2" value={address.line2} onChange={(value) => setAddress({ ...address, line2: value })} />
              <AddressInput label="City" value={address.city} onChange={(value) => setAddress({ ...address, city: value })} />
              <AddressInput label="State" value={address.state} onChange={(value) => setAddress({ ...address, state: value })} />
              <AddressInput label="Postal Code" value={address.postalCode} onChange={(value) => setAddress({ ...address, postalCode: value })} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={address.isDefault} onChange={(event) => setAddress({ ...address, isDefault: event.target.checked })} /> Set as default</label>
              <button className="rounded-full bg-orange px-5 py-2.5 text-sm text-white md:col-span-2">Add Address</button>
              {message ? <p className="text-sm text-brand md:col-span-2">{message}</p> : null}
            </form>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-2xl">Order History</h2>
          <div className="mt-4 space-y-3">
            {orders.data?.content.map((order) => (
              <article key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
                <div><p className="font-semibold">{order.orderNumber}</p><p className="text-xs text-muted-foreground">{new Date(order.orderDate).toLocaleString()}</p></div>
                <div className="text-sm">{order.status}</div>
                <div className="font-semibold text-brand">₹{order.grandTotal.toFixed(2)}</div>
              </article>
            ))}
            {!orders.isLoading && !orders.data?.content.length ? <p className="text-sm text-muted-foreground">No orders yet.</p> : null}
          </div>
        </section>
      </section>
      <Newsletter />
      <Footer />
    </div>
  );
}

function AccountForm({ profile, onSaved }: { profile?: CustomerProfile; onSaved: () => void }) {
  const [email, setEmail] = useState(profile?.email || "");
  const [mobile, setMobile] = useState(profile?.mobile || "");
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [emailDevOtp, setEmailDevOtp] = useState("");
  const [mobileDevOtp, setMobileDevOtp] = useState("");
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const emailChanged = email.trim() !== (profile?.email || "");
  const mobileChanged = mobile.trim() !== (profile?.mobile || "");

  useEffect(() => {
    setEmail(profile?.email || "");
    setMobile(profile?.mobile || "");
    setEmailOtp("");
    setMobileOtp("");
    setEmailDevOtp("");
    setMobileDevOtp("");
  }, [profile?.id, profile?.email, profile?.mobile]);

  const requestContactOtp = async (kind: "email" | "mobile") => {
    setMessage("");
    setLoading(true);
    try {
      const identifier = kind === "email" ? email.trim() : mobile.trim();
      if (!identifier) throw new Error(`Enter a ${kind} first.`);
      const challenge = await api.requestContactOtp(
        identifier,
        kind === "email" ? "CHANGE_EMAIL" : "CHANGE_MOBILE",
      );
      const devOtp = findDevelopmentOtp(challenge);
      if (kind === "email") {
        setEmailDevOtp(devOtp);
        setEmailOtp(devOtp);
      } else {
        setMobileDevOtp(devOtp);
        setMobileOtp(devOtp);
      }
      setMessage(`Verification OTP sent to ${challenge.maskedDestination || identifier}.`);
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      key={profile?.id}
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setLoading(true);
        setMessage("");
        try {
          if (emailChanged && !emailOtp.trim()) throw new Error("Verify the new email with its OTP.");
          if (mobileChanged && !mobileOtp.trim()) throw new Error("Verify the new mobile number with its OTP.");

          await api.updateBasicProfile({
            name: String(form.get("displayName")).trim(),
            email: email.trim() || undefined,
            emailOtp: emailChanged ? emailOtp.trim() : undefined,
            mobile: mobile.trim() || undefined,
            mobileOtp: mobileChanged ? mobileOtp.trim() : undefined,
          });
          await api.updateProfile({
            displayName: String(form.get("displayName")),
            email: email.trim(),
            mobile: mobile.trim(),
            gstin: String(form.get("gstin")),
            pan: String(form.get("pan")),
            creditLimit: Number(form.get("creditLimit")) || 0,
            paymentTermsDays: Number(form.get("paymentTermsDays")) || 0,
            notes: String(form.get("notes")),
          });
          if (passwordEnabled) {
            const newPassword = String(form.get("newPassword"));
            const confirmation = String(form.get("confirmPassword"));
            if (newPassword !== confirmation) throw new Error("Passwords do not match.");
            await api.updatePassword(
              newPassword,
              profile?.passwordSet ? String(form.get("currentPassword")) : undefined,
            );
          }
          setMessage("Profile updated.");
          onSaved();
        } catch (caught) {
          setMessage(caught instanceof Error ? caught.message : "Could not update profile");
        } finally {
          setLoading(false);
        }
      }}
      className="rounded-2xl border border-border bg-card p-5"
    >
      <h2 className="text-2xl">Account Details</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ProfileInput name="displayName" label="Display Name" defaultValue={profile?.name || profile?.displayName} />
        <ProfileInput name="gstin" label="GSTIN" defaultValue={profile?.gstin || ""} />

        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm">Email {profile?.emailVerified ? <Verified /> : null}</span>
            {emailChanged ? (
              <button type="button" disabled={loading} onClick={() => void requestContactOtp("email")} className="text-xs font-medium text-brand">
                Send verification OTP
              </button>
            ) : null}
          </div>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-10 w-full rounded-lg border border-border px-3" />
          {emailChanged ? (
            <input value={emailOtp} onChange={(event) => setEmailOtp(event.target.value)} inputMode="numeric" placeholder="Email OTP" className="h-10 w-full rounded-lg border border-border px-3" />
          ) : null}
          {emailDevOtp ? <DevOtp value={emailDevOtp} /> : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm">Mobile {profile?.mobileVerified ? <Verified /> : null}</span>
            {mobileChanged ? (
              <button type="button" disabled={loading} onClick={() => void requestContactOtp("mobile")} className="text-xs font-medium text-brand">
                Send verification OTP
              </button>
            ) : null}
          </div>
          <input type="tel" value={mobile} onChange={(event) => setMobile(event.target.value)} className="h-10 w-full rounded-lg border border-border px-3" />
          {mobileChanged ? (
            <input value={mobileOtp} onChange={(event) => setMobileOtp(event.target.value)} inputMode="numeric" placeholder="Mobile OTP" className="h-10 w-full rounded-lg border border-border px-3" />
          ) : null}
          {mobileDevOtp ? <DevOtp value={mobileDevOtp} /> : null}
        </div>

        <ProfileInput name="pan" label="PAN" defaultValue={profile?.pan || ""} />
        <ProfileInput name="creditLimit" label="Credit Limit" type="number" defaultValue={String(profile?.creditLimit ?? "")} />
        <ProfileInput name="paymentTermsDays" label="Payment Terms (Days)" type="number" defaultValue={String(profile?.paymentTermsDays ?? "")} />
        <ProfileInput name="notes" label="Notes" defaultValue={profile?.notes || ""} />
      </div>

      <label className="mt-5 flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={passwordEnabled} onChange={(event) => setPasswordEnabled(event.target.checked)} />
        {profile?.passwordSet ? "Change password" : "Set a password for future logins"}
      </label>
      {passwordEnabled ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {profile?.passwordSet ? (
            <ProfileInput name="currentPassword" label="Current Password" type="password" minLength={8} required />
          ) : null}
          <ProfileInput name="newPassword" label="New Password" type="password" minLength={8} required />
          <ProfileInput name="confirmPassword" label="Confirm Password" type="password" minLength={8} required />
        </div>
      ) : null}

      <button disabled={loading} className="mt-4 rounded-full bg-brand px-5 py-2.5 text-sm text-white disabled:opacity-60">
        {loading ? "Saving..." : "Save Profile"}
      </button>
      {message ? <p className="mt-2 text-sm text-brand">{message}</p> : null}
    </form>
  );
}

function ProfileInput({
  name,
  label,
  defaultValue,
  type = "text",
  minLength,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  minLength?: number;
  required?: boolean;
}) {
  return (
    <label className="space-y-1 text-sm">
      <span>{label}</span>
      <input name={name} type={type} defaultValue={defaultValue} minLength={minLength} required={required} className="h-10 w-full rounded-lg border border-border px-3" />
    </label>
  );
}

function Verified() {
  return <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-brand">Verified</span>;
}

function DevOtp({ value }: { value: string }) {
  return <p className="text-xs text-brand">Development OTP: <strong>{value}</strong></p>;
}

function AddressInput({ label, value, required, onChange }: { label: string; value?: string; required?: boolean; onChange: (value: string) => void }) {
  return <label className="space-y-1 text-sm"><span>{label}</span><input required={required} value={value || ""} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-lg border border-border px-3" /></label>;
}
