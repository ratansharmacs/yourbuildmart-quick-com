import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";

export const Route = createFileRoute("/orders")({ component: OrdersPage });
function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const orders = useQuery({ queryKey: ["orders"], queryFn: () => api.orders({ page: 0, size: 50, sortBy: "orderDate", direction: "DESC" }), enabled: isAuthenticated });
  return <div className="flex min-h-dvh flex-col"><Navbar /><main className="container-page flex-1 py-10"><h1 className="text-4xl">My Orders</h1><p className="mt-2 text-muted-foreground">Track and review your order history.</p>{!isAuthenticated ? <Link to="/login" className="mt-6 inline-flex rounded-full bg-brand px-5 py-2 text-white">Login</Link> : <div className="mt-8 space-y-4">{orders.data?.content.map((order) => <article key={order.id} className="rounded-2xl border border-border bg-card p-5"><div className="flex flex-wrap justify-between gap-3"><div><strong>{order.orderNumber}</strong><p className="text-xs text-muted-foreground">{new Date(order.orderDate).toLocaleString()}</p></div><span className="rounded-full bg-secondary px-3 py-1 text-xs">{order.status.replaceAll("_", " ")}</span><strong className="text-brand">₹{order.grandTotal.toFixed(2)}</strong></div><div className="mt-4 text-sm text-muted-foreground">{order.items.map((item) => `${item.productName} × ${item.orderedQty}`).join(", ")}</div></article>)}{orders.isLoading ? <p>Loading orders...</p> : null}{!orders.isLoading && !orders.data?.content.length ? <p className="text-muted-foreground">No orders yet.</p> : null}</div>}</main><Footer /></div>;
}
