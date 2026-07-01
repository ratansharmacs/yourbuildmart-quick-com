import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { ProductCard } from "@/components/site/ProductCard";
import { useShop } from "@/context/shop-context";

export const Route = createFileRoute("/wishlist")({ component: WishlistPage });
function WishlistPage() {
  const { wishlist } = useShop();
  return <div className="flex min-h-dvh flex-col"><Navbar /><main className="container-page flex-1 py-10"><h1 className="text-4xl">My Wishlist</h1>{wishlist.length ? <div className="mt-8 flex flex-wrap justify-center gap-5">{wishlist.map((product) => <div key={`${product.id}-${product.variantId}`} className="w-[calc(50%-0.625rem)] md:w-[calc(25%-0.938rem)]"><ProductCard product={product} /></div>)}</div> : <div className="mt-8 rounded-2xl border border-border p-8 text-center"><p className="text-muted-foreground">Your wishlist is empty.</p><Link to="/products" className="mt-4 inline-flex rounded-full bg-brand px-5 py-2 text-white">Browse products</Link></div>}</main><Footer /></div>;
}
