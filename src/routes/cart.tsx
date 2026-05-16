import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ProductImage } from "@/components/site/ProductImage";
import { useShop } from "@/context/shop-context";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — YourBuildMart" },
      { name: "description", content: "Review items in your cart before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cartItems, updateCartQuantity, removeFromCart } = useShop();
  const subTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (!cartItems.length) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <section className="container-page flex-1 py-10">
          <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-6 text-center md:p-10">
            <h1 className="text-3xl">Your Cart</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Your selected products will appear here. Add products to continue.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-orange-foreground"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <section className="container-page flex-1 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <h1 className="mb-5 text-3xl">Your Cart</h1>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                  <div className="grid h-24 w-24 place-items-center rounded-lg bg-[--peach] p-2">
                    <ProductImage product={item.product} className="h-20 w-20 object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-foreground">{item.product.name}</p>
                    <p className="mt-1 text-sm text-brand">₹{item.product.price}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="grid h-7 w-7 place-items-center rounded-full border border-border"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="grid h-7 w-7 place-items-center rounded-full border border-border"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-orange">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="h-fit rounded-2xl border border-border bg-card p-5">
            <h2 className="text-xl">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>Free</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-base font-semibold text-foreground">
                <span>Total</span>
                <span>₹{subTotal.toFixed(2)}</span>
              </div>
            </div>
            <button className="mt-5 w-full rounded-full bg-brand py-3 text-sm font-medium text-brand-foreground">Proceed to Checkout</button>
            <Link to="/products" className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-orange py-2.5 text-sm font-medium text-orange">
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}