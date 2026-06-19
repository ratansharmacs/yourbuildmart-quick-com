import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { ProductCard } from "@/components/site/ProductCard";
import { useShop } from "@/context/shop-context";

export const Route = createFileRoute("/wishlist")({ component: WishlistPage });
function WishlistPage() {
  const { wishlist } = useShop();
  return <div className="flex min-h-dvh flex-col"><Navbar /><main className="container-page flex-1 py-10"><h1 className="text-4xl">My Wishlist</h1>{wishlist.length ? <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">{wishlist.map((product) => <ProductCard key={`${product.id}-${product.variantId}`} product={product} />)}</div> : <div className="mt-8 rounded-2xl border border-border p-8 text-center"><p className="text-muted-foreground">Your wishlist is empty.</p><Link to="/products" className="mt-4 inline-flex rounded-full bg-brand px-5 py-2 text-white">Browse products</Link></div>}</main><Footer /></div>;
}
