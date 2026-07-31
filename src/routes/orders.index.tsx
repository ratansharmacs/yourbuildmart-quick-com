import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";

export const Route = createFileRoute("/orders/")({ component: OrdersPage });

function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const orders = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.orders({ page: 0, size: 50, sortBy: "orderDate", direction: "DESC" }),
    enabled: isAuthenticated,
  });
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="container-page flex-1 py-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl">My Orders</h1>
          <p className="mt-2 text-muted-foreground">Track and review your order history.</p>
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="mt-6 inline-flex rounded-full bg-brand px-5 py-2 text-white"
            >
              Login
            </Link>
          ) : (
            <div className="mt-8 space-y-5">
              {orders.data?.content.map((order) => (
                <Link
                  key={order.id}
                  to="/orders/$orderId"
                  params={{ orderId: String(order.id) }}
                  className="block rounded-2xl border border-border bg-card p-6 transition hover:border-brand hover:shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold">Order #{order.orderNumber}</h2>
                        <span className="rounded-full bg-secondary px-3 py-1 text-xs">
                          {order.status.replaceAll("_", " ")}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                      <p className="mt-4 text-sm">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                    <div className="text-right">
                      <strong className="text-2xl text-brand">
                        ₹{order.grandTotal.toFixed(2)}
                      </strong>
                      <span className="mt-5 block text-sm font-medium text-brand">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
              {orders.isLoading ? <p>Loading orders...</p> : null}
              {orders.error ? <p className="text-red-600">{orders.error.message}</p> : null}
              {!orders.isLoading && !orders.data?.content.length ? (
                <p className="text-muted-foreground">No orders yet.</p>
              ) : null}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
