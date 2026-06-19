import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { ProductImage } from "@/components/site/ProductImage";
import { useShop } from "@/context/shop-context";
import { api, type CheckoutPreview, type CheckoutSession } from "@/lib/api";
import { clearCheckoutState, loadCheckoutState } from "@/lib/checkout-state";
import { CheckoutSteps } from "@/routes/checkout.shipping";

export const Route = createFileRoute("/checkout/review")({
  head: () => ({ meta: [{ title: "Order Review - YourBuildMart" }] }), component: ReviewPage,
});

function ReviewPage() {
  const navigate = useNavigate();
  const { cartItems, cartLoading, clearCart } = useShop();
  const checkout = useMemo(loadCheckoutState, []);
  const [preview, setPreview] = useState<CheckoutPreview>();
  const [session, setSession] = useState<CheckoutSession>();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const items = useMemo(() => cartItems.flatMap((item) => item.product.variantId ? [{ productId: item.product.apiId, variantId: item.product.variantId, quantity: item.quantity, unitPrice: item.product.price }] : []), [cartItems]);

  useEffect(() => {
    if (!checkout) { void navigate({ to: "/checkout/shipping" }); return; }
    if (cartLoading || !items.length) return;
    api.checkoutPreview(checkout.addressId, items, checkout.remarks).then(setPreview).catch((e) => setMessage(e.message));
  }, [cartLoading, checkout, items, navigate]);

  const placeOrder = async () => {
    if (!checkout) return;
    setLoading(true); setMessage("");
    try {
      const started = await api.startCheckout(checkout.addressId, items, checkout.remarks);
      const confirmed = await api.confirmCheckout(started.orders.map((order) => order.id), started.paymentMethod || "COD");
      setSession(confirmed); await clearCart(); clearCheckoutState();
    } catch (e) { setMessage(e instanceof Error ? e.message : "Order could not be placed"); }
    finally { setLoading(false); }
  };

  if (session) return <div className="flex min-h-screen flex-col"><Navbar /><main className="container-page flex-1 py-10"><CheckoutSteps active={3} /><section className="mx-auto mt-10 max-w-2xl rounded-3xl border border-brand bg-card p-8 text-center"><h1 className="text-4xl">Order Confirmed</h1><p className="mt-3 text-muted-foreground">Thank you. Your order has been placed successfully.</p><p className="mt-5 font-semibold">Order {session.orders.map((o) => o.orderNumber).join(", ")}</p><p className="mt-2 text-2xl text-brand">₹{session.totalAmount.toFixed(2)}</p><Link to="/profile" className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-white">View My Orders</Link></section></main><Footer /></div>;

  const localTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return <div className="flex min-h-screen flex-col bg-background"><Navbar /><main className="container-page flex-1 py-10"><CheckoutSteps active={2} />
    <div className="mx-auto mt-8 grid max-w-5xl gap-6 lg:grid-cols-[1fr_340px]"><section className="rounded-2xl border border-border bg-card p-6"><h1 className="text-3xl">Order Review</h1><div className="mt-5 space-y-4">{cartItems.map((item) => <article key={`${item.product.id}-${item.product.variantId}`} className="flex gap-4 border-b border-border pb-4"><ProductImage product={item.product} className="h-20 w-20 rounded-lg bg-secondary object-contain" /><div className="flex-1"><h2 className="font-semibold">{item.product.name}</h2><p className="text-sm text-muted-foreground">Qty: {item.quantity}</p></div><strong>₹{(item.product.price * item.quantity).toFixed(2)}</strong></article>)}</div></section>
    <aside className="h-fit rounded-2xl border border-border bg-card p-6"><h2 className="text-xl">Price Details</h2><div className="mt-4 flex justify-between"><span>Subtotal</span><span>₹{(preview?.subtotal ?? localTotal).toFixed(2)}</span></div><div className="my-4 border-t border-border" /><div className="flex justify-between text-lg font-semibold"><span>Total</span><span>₹{(preview?.grandTotal ?? localTotal).toFixed(2)}</span></div><button onClick={() => void placeOrder()} disabled={loading || !preview?.serviceable} className="mt-5 w-full rounded-xl bg-orange py-3 font-semibold text-white disabled:opacity-50">{loading ? "Placing order..." : "Place Order"}</button>{message ? <p className="mt-3 text-sm text-red-600">{message}</p> : null}<Link to="/checkout/shipping" className="mt-3 block text-center text-sm text-brand">Change shipping details</Link></aside></div>
  </main><Footer /></div>;
}
