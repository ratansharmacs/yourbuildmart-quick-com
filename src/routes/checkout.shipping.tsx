import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { ProductImage } from "@/components/site/ProductImage";
import { useAuth } from "@/context/auth-context";
import { useShop } from "@/context/shop-context";
import { api, type AddressRequest, type CheckoutPreview } from "@/lib/api";
import { loadCheckoutState, saveCheckoutState } from "@/lib/checkout-state";

export const Route = createFileRoute("/checkout/shipping")({
  head: () => ({ meta: [{ title: "Shipping Details - YourBuildMart" }] }),
  component: ShippingPage,
});

type ShippingForm = AddressRequest & { email: string };

const emptyAddress: ShippingForm = {
  addressType: "SHIPPING",
  contactName: "",
  email: "",
  mobile: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  countryId: 101,
  isDefault: true,
};

function ShippingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, requestLoginOtp, loginWithOtp } = useAuth();
  const { cartItems, mergeGuestCart } = useShop();
  const [selected, setSelected] = useState<number>();
  const [remarks, setRemarks] = useState("");
  const [form, setForm] = useState<ShippingForm>(emptyAddress);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpDestination, setOtpDestination] = useState("");
  const [preview, setPreview] = useState<CheckoutPreview>();
  const [previewLoading, setPreviewLoading] = useState(false);

  const addresses = useQuery({
    queryKey: ["addresses"],
    queryFn: api.addresses,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!selected && !showForm && addresses.data?.length) {
      setSelected(addresses.data.find((address) => address.isDefault)?.id || addresses.data[0].id);
    }
    if (addresses.data && !addresses.data.length) setShowForm(true);
  }, [addresses.data, selected, showForm]);

  const items = useMemo(
    () =>
      cartItems.flatMap((item) =>
        item.product.variantId
          ? [
              {
                productId: item.product.apiId,
                variantId: item.product.variantId,
                quantity: item.quantity,
                unitPrice: item.product.price,
              },
            ]
          : [],
      ),
    [cartItems],
  );
  const identifier = form.email.trim() || form.mobile.trim();
  const effectiveAddressId = selected ?? addresses.data?.[0]?.id;

  useEffect(() => {
    if (!isAuthenticated || !effectiveAddressId || !items.length) {
      setPreview(undefined);
      return;
    }
    let active = true;
    const timer = window.setTimeout(() => {
      setPreviewLoading(true);
      const couponCodes = loadCheckoutState()?.couponCodes || [];
      api
        .checkoutPreview(effectiveAddressId, items, remarks, "CASHFREE", couponCodes)
        .then((result) => {
          if (active) {
            setPreview(result);
            setMessage(
              result.serviceable ? "" : result.message || "This address is not serviceable.",
            );
          }
        })
        .catch((error) => {
          if (active) setMessage(error.message);
        })
        .finally(() => {
          if (active) setPreviewLoading(false);
        });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [effectiveAddressId, isAuthenticated, items, remarks]);

  const validateForm = () => {
    if (
      !form.contactName.trim() ||
      !form.line1.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.postalCode.trim()
    ) {
      throw new Error("Complete all required shipping-address fields.");
    }
    if (!form.email.trim() && !form.mobile.trim())
      throw new Error("Enter at least an email address or mobile number.");
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      throw new Error("Enter a valid email address.");
  };

  const addressPayload = (): AddressRequest => {
    const { email: _email, ...address } = form;
    return address;
  };

  const previewAndContinue = async (addressId: number) => {
    const couponCodes = loadCheckoutState()?.couponCodes || [];
    const latestPreview = await api.checkoutPreview(
      addressId,
      items,
      remarks,
      "CASHFREE",
      couponCodes,
    );
    if (!latestPreview.serviceable)
      throw new Error(latestPreview.message || "This address is not serviceable.");
    saveCheckoutState({ addressId, remarks, couponCodes });
    await navigate({ to: "/checkout/review" });
  };

  const saveAddress = async () => {
    setMessage("");
    setSuccess("");
    if (!isAuthenticated) {
      setMessage("Login or verify with OTP to save this address.");
      return;
    }
    if (selected && !showForm) {
      setSuccess("Selected address is ready.");
      return;
    }
    setLoading(true);
    try {
      validateForm();
      const address = await api.createAddress(addressPayload());
      await queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setSelected(address.id);
      setShowForm(false);
      setSuccess("Address saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save address");
    } finally {
      setLoading(false);
    }
  };

  const continueToReview = async () => {
    if (!items.length) {
      setMessage("Your cart has no checkout-ready products.");
      return;
    }
    setMessage("");
    setSuccess("");
    setLoading(true);
    try {
      if (!isAuthenticated) {
        validateForm();
        const result = await requestLoginOtp(identifier);
        setOtpDestination(result.challenge.maskedDestination || identifier);
        setOtp("");
        setOtpOpen(true);
        return;
      }
      let addressId = selected ?? addresses.data?.[0]?.id;
      if (!addressId) {
        validateForm();
        addressId = (await api.createAddress(addressPayload())).id;
      }
      await previewAndContinue(addressId);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to continue");
    } finally {
      setLoading(false);
    }
  };

  const verifyCheckoutOtp = async () => {
    setMessage("");
    setLoading(true);
    try {
      await loginWithOtp(identifier, otp.trim());
      await mergeGuestCart();
      const address = await api.createAddress(addressPayload());
      setOtpOpen(false);
      await previewAndContinue(address.id);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Navbar />
      <main className="container-page flex-1 py-10">
        <CheckoutSteps active={1} />
        <div className="mx-auto mt-8 grid max-w-6xl gap-6 lg:grid-cols-[1fr_400px]">
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl">Shipping Details</h1>
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setShowForm(true);
                    setSuccess("");
                  }}
                  className="text-sm font-medium text-brand"
                >
                  + Add address
                </button>
              ) : null}
            </div>

            {isAuthenticated && addresses.data?.length ? (
              <label className="mt-5 block">
                <span className="mb-2 block text-xs font-medium text-muted-foreground">
                  Saved addresses
                </span>
                <select
                  value={selected || ""}
                  onChange={(event) => {
                    setSelected(event.target.value ? Number(event.target.value) : undefined);
                    setShowForm(false);
                    setSuccess("");
                  }}
                  className="h-12 w-full rounded-full border border-border bg-secondary px-5 text-sm font-medium text-brand outline-none focus:ring-2 focus:ring-brand/20"
                >
                  <option value="">-- Select saved address --</option>
                  {addresses.data.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.contactName || address.addressType} - {address.line1}, {address.city}{" "}
                      {address.postalCode}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            {!isAuthenticated ? (
              <p className="mt-2 text-sm text-muted-foreground">
                No login is required now. We will verify your email or mobile number with OTP before
                order review.
              </p>
            ) : null}

            {!isAuthenticated || showForm ? (
              <div className="mt-5 grid gap-3 rounded-xl bg-secondary p-4 md:grid-cols-2">
                <ShippingInput
                  label="Full Name"
                  required
                  value={form.contactName}
                  onChange={(value) => setForm({ ...form, contactName: value })}
                />
                <ShippingInput
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(value) => setForm({ ...form, email: value })}
                />
                <ShippingInput
                  label="Mobile Number"
                  value={form.mobile}
                  onChange={(value) => setForm({ ...form, mobile: value })}
                />
                <p className="self-end pb-2 text-xs text-muted-foreground">
                  At least one of email or mobile is required.
                </p>
                <ShippingInput
                  label="Address Line 1"
                  required
                  wide
                  value={form.line1}
                  onChange={(value) => setForm({ ...form, line1: value })}
                />
                <ShippingInput
                  label="Address Line 2"
                  wide
                  value={form.line2}
                  onChange={(value) => setForm({ ...form, line2: value })}
                />
                <ShippingInput
                  label="City"
                  required
                  value={form.city}
                  onChange={(value) => setForm({ ...form, city: value })}
                />
                <ShippingInput
                  label="State"
                  required
                  value={form.state}
                  onChange={(value) => setForm({ ...form, state: value })}
                />
                <ShippingInput
                  label="Postal Code"
                  required
                  value={form.postalCode}
                  onChange={(value) => setForm({ ...form, postalCode: value })}
                />
              </div>
            ) : null}

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-semibold">Delivery notes (optional)</span>
              <textarea
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                placeholder="Landmark or delivery instructions"
                className="min-h-24 w-full rounded-xl border border-border p-3"
              />
            </label>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <Link to="/cart" className="text-sm font-medium text-brand">
                ← Back to Cart
              </Link>
              <div className="flex gap-3">
                <button
                  onClick={() => void saveAddress()}
                  disabled={loading}
                  className="rounded-xl border border-brand px-5 py-3 text-sm font-semibold text-brand disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Address"}
                </button>
                <button
                  onClick={() => void continueToReview()}
                  disabled={loading}
                  className="rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {loading ? "Please wait..." : "Review Order"}
                </button>
              </div>
            </div>
            {success ? <p className="mt-3 text-sm text-brand">{success}</p> : null}
            {message && !otpOpen ? <p className="mt-3 text-sm text-red-600">{message}</p> : null}
          </section>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl">Your Order</h2>
                <p className="text-sm text-muted-foreground">({cartItems.length} items)</p>
              </div>
              <Link to="/cart" className="text-sm font-medium text-brand">Edit Cart</Link>
            </div>
            <div className="mt-5 space-y-4">
              {cartItems.map((item) => {
                const originalPrice = item.product.oldPrice ?? item.product.price;
                const saving = Math.max(0, originalPrice - item.product.price);
                const percent = saving > 0 ? Math.round((saving / originalPrice) * 100) : 0;
                return (
                  <div key={`${item.product.id}-${item.product.variantId}`} className="flex gap-3">
                    <ProductImage product={item.product} className="h-20 w-20 rounded-xl bg-secondary object-contain" />
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-semibold">{item.product.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                        <strong className="text-sm">₹{item.product.price.toFixed(2)}</strong>
                        {saving > 0 ? <span className="text-muted-foreground line-through">₹{originalPrice.toFixed(2)}</span> : null}
                        {percent > 0 ? <span className="rounded-full bg-orange/15 px-2 py-1 font-semibold text-orange">Save {percent}%</span> : null}
                      </div>
                    </div>
                    <strong className="text-sm">₹{(item.product.price * item.quantity).toFixed(2)}</strong>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Order summary</h2>
                {previewLoading ? (
                  <span className="text-xs text-muted-foreground">Updating...</span>
                ) : null}
              </div>
              <PreviewRow
                label="Subtotal"
                value={preview ? preview.subtotal - (preview.taxTotal ?? 0) : undefined}
              />
              {preview?.discountAmount ? (
                <PreviewRow label="Discount" value={-preview.discountAmount} />
              ) : null}
              <PreviewRow label="Tax" value={preview?.taxTotal} />
              <PreviewRow label="Shipping" value={preview?.shippingAmount} />
              <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold">
                <span>Total</span>
                <span>{preview ? `₹${preview.grandTotal.toFixed(2)}` : "—"}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />

      {otpOpen ? (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-otp-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 id="checkout-otp-title" className="text-2xl">
                  Verify Your Details
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter the OTP sent to {otpDestination} to continue to order review.
                </p>
              </div>
              <button onClick={() => setOtpOpen(false)} aria-label="Close OTP dialog">
                <X className="h-5 w-5" />
              </button>
            </div>
            <label className="mt-5 block text-sm">
              <span className="font-medium">Verification OTP</span>
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                className="mt-1 h-11 w-full rounded-lg border border-border px-3"
              />
            </label>
            {message ? <p className="mt-3 text-sm text-red-600">{message}</p> : null}
            <button
              onClick={() => void verifyCheckoutOtp()}
              disabled={loading || !otp.trim()}
              className="mt-5 w-full rounded-xl bg-orange py-3 font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify & Review Order"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value?: number }) {
  return (
    <div className="mt-2 flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span>{value == null ? "—" : `${value < 0 ? "−" : ""}₹${Math.abs(value).toFixed(2)}`}</span>
    </div>
  );
}

function ShippingInput({
  label,
  value,
  onChange,
  required,
  type = "text",
  wide,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="mb-1 block text-xs">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-border px-3"
      />
    </label>
  );
}

export function CheckoutSteps({ active }: { active: 1 | 2 | 3 }) {
  return (
    <div className="mx-auto flex max-w-xl items-center justify-center text-sm">
      {["Shipping", "Order Review", "Confirmed"].map((label, index) => (
        <div key={label} className="flex items-center">
          <span
            className={`rounded-full px-3 py-1.5 ${active >= index + 1 ? "bg-brand text-white" : "bg-secondary"}`}
          >
            {index + 1}. {label}
          </span>
          {index < 2 ? <span className="h-px w-5 bg-border md:w-12" /> : null}
        </div>
      ))}
    </div>
  );
}
