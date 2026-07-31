import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";

export const Route = createFileRoute("/orders/$orderId")({
  head: () => ({ meta: [{ title: "Order Details - YourBuildMart" }] }),
  component: OrderDetailsPage,
});
const cancellableStatuses = new Set(["PENDING_PAYMENT", "CONFIRMED"]);

function OrderDetailsPage() {
  const id = Number(Route.useParams().orderId);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const order = useQuery({
    queryKey: ["order", id],
    queryFn: () => api.order(id),
    enabled: isAuthenticated && Number.isInteger(id) && id > 0,
  });
  const cancel = useMutation({
    mutationFn: () => api.cancelOrder(id),
    onSuccess: (result) => {
      queryClient.setQueryData(["order", id], result);
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
  if (!isAuthenticated)
    return (
      <Page>
        <h1 className="text-4xl">Order Details</h1>
        <p className="mt-3 text-muted-foreground">Please log in to view this order.</p>
        <Link to="/login" className="mt-6 inline-flex rounded-full bg-brand px-5 py-2 text-white">
          Login
        </Link>
      </Page>
    );
  if (!Number.isInteger(id) || id <= 0)
    return (
      <Page>
        <p className="text-red-600">Invalid order ID.</p>
      </Page>
    );
  if (order.isLoading)
    return (
      <Page>
        <p>Loading order details...</p>
      </Page>
    );
  if (order.error || !order.data)
    return (
      <Page>
        <p className="text-red-600">{order.error?.message || "Order not found."}</p>
      </Page>
    );
  const details = order.data;
  const canCancel = cancellableStatuses.has(details.status);

  return (
    <Page>
      <div className="mx-auto max-w-5xl">
        <Link to="/orders" className="text-sm text-brand">
          ← Back to my orders
        </Link>
        <section className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl">Order #{details.orderNumber}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{formatDate(details.orderDate)}</p>
            </div>
            <div className="text-right">
              <strong className="text-3xl text-brand">₹{details.grandTotal.toFixed(2)}</strong>
              <div className="mt-3">
                <Status value={details.status} />
              </div>
              {canCancel ? (
                <button
                  disabled={cancel.isPending}
                  onClick={() => {
                    if (window.confirm("Cancel this order? This action cannot be undone."))
                      cancel.mutate();
                  }}
                  className="mt-3 rounded-lg border border-red-600 px-4 py-2 text-sm text-red-600 disabled:opacity-50"
                >
                  {cancel.isPending ? "Cancelling..." : "Cancel Order"}
                </button>
              ) : null}
            </div>
          </div>
          <p className="mt-4 text-right text-xs text-muted-foreground">
            Cancellation is available while the order is pending payment or confirmed. Once packed,
            shipped, delivered, expired, or already cancelled, cancellation is blocked.
          </p>
          {cancel.error ? (
            <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {cancel.error.message}
            </p>
          ) : null}
        </section>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <InfoCard title="Order Information">
            <InfoRow label="Order ID" value={String(details.id)} />
            <InfoRow label="Order Number" value={details.orderNumber} />
            <InfoRow label="Status" value={pretty(details.status)} />
            <InfoRow label="Order Date" value={formatDate(details.orderDate)} />
            <InfoRow label="Confirmed At" value={formatDate(details.confirmedAt)} />
            <InfoRow label="Customer Name" value={details.customerName} />
            <InfoRow
              label="Warehouse"
              value={
                details.warehouseName ||
                (details.warehouseId ? `#${details.warehouseId}` : undefined)
              }
            />
          </InfoCard>
          <InfoCard title="Delivery Information">
            <InfoRow label="Ship To" value={details.shipToName} />
            <InfoRow label="Phone" value={details.shipToPhone} />
            <InfoRow label="Address" value={details.shipToAddress} />
            <InfoRow
              label="Delivery Address ID"
              value={details.deliveryAddressId ? String(details.deliveryAddressId) : undefined}
            />
            {details.shippingPartnerName ? (
              <InfoRow label="Shipping Partner" value={details.shippingPartnerName} />
            ) : null}
            {details.trackingNumber ? (
              <InfoRow label="Tracking Number" value={details.trackingNumber} />
            ) : null}
            {details.trackingUrl ? (
              <a
                href={externalUrl(details.trackingUrl)}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex text-sm text-brand"
              >
                Track shipment →
              </a>
            ) : null}
          </InfoCard>
          <InfoCard title="Payment">
            <InfoRow label="Method" value={pretty(details.paymentMethod)} />
            <InfoRow
              label="Payment Status"
              value={details.paymentConfirmedAt ? "Paid" : pretty(details.status)}
            />
            <InfoRow label="Payment Confirmed At" value={formatDate(details.paymentConfirmedAt)} />
            <InfoRow
              label="Payment Window Expires"
              value={formatDate(details.paymentWindowExpiresAt)}
            />
          </InfoCard>
          <InfoCard title="Totals">
            <MoneyRow label="Subtotal" value={details.subtotal} />
            {details.couponDiscountAmount ? (
              <MoneyRow label="Coupon Discount" value={-details.couponDiscountAmount} />
            ) : null}
            {details.discountAmount ? (
              <MoneyRow label="Discount" value={-details.discountAmount} />
            ) : null}
            <MoneyRow label="Tax" value={details.taxAmount} />
            <MoneyRow label="Shipping" value={details.shippingAmount} />
            <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold">
              <span>Total</span>
              <span>₹{details.grandTotal.toFixed(2)}</span>
            </div>
          </InfoCard>
        </div>
        <section className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-2xl">Items</h2>
          <div className="mt-4 space-y-3">
            {details.items.map((item) => (
              <article
                key={item.id}
                className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-border p-4"
              >
                <div>
                  <h3 className="font-semibold">{item.productName}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[item.variantLabel, item.sku].filter(Boolean).join(" · ")}
                  </p>
                  <p className="mt-1 text-sm">
                    Quantity: {item.orderedQty}
                    {item.shippedQty != null ? ` · Shipped: ${item.shippedQty}` : ""}
                  </p>
                </div>
                <strong>₹{item.lineTotal.toFixed(2)}</strong>
              </article>
            ))}
          </div>
          {details.remarks ? (
            <p className="mt-5 text-sm text-muted-foreground">
              <strong>Order notes:</strong> {details.remarks}
            </p>
          ) : null}
        </section>
      </div>
    </Page>
  );
}

function Page({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="container-page flex-1 py-10">{children}</main>
      <Footer />
    </div>
  );
}
function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-xl">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}
function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
function MoneyRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span>
        {value < 0 ? "−" : ""}₹{Math.abs(value).toFixed(2)}
      </span>
    </div>
  );
}
function Status({ value }: { value: string }) {
  return (
    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{pretty(value)}</span>
  );
}
function pretty(value?: string | null) {
  return value
    ? value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "—";
}
function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleString() : undefined;
}
function externalUrl(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}
