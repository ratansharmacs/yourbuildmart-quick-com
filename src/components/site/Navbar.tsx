import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Heart, LogOut, Search, ShoppingBag, User } from "lucide-react";
import { Logo } from "./Logo";
import { useShop } from "@/context/shop-context";
import { useAuth } from "@/context/auth-context";
import { api, resolveApiImage } from "@/lib/api";

const navItems = [
  { to: "/hot-deals", label: "Hot Deals" },
  { to: "/cement-concrete", label: "Cement & Concrete" },
  { to: "/hardware", label: "Hardware" },
  { to: "/electrical", label: "Electrical" },
  { to: "/plumbing", label: "Plumbing" },
  { to: "/flash-sale", label: "Flash Sale" },
] as const;

export function Navbar() {
  const { cartCount, wishlistCount } = useShop();
  const { isAuthenticated, user, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  return <><header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-gradient-to-r from-white to-[--peach]">
    <div className="container-page"><div className="flex h-14 items-center gap-3 md:gap-6">
      <Link to="/" className="shrink-0"><Logo /></Link>
      <nav className="hidden flex-1 items-center justify-between px-4 lg:flex">{navItems.map((item) => <Link key={item.to} to={item.to} className={`text-sm transition hover:text-brand ${item.label === "Hot Deals" || item.label === "Flash Sale" ? "text-orange" : "text-foreground/80"}`} activeProps={{ className: "font-semibold text-brand" }}>{item.label === "Hot Deals" ? "🔥 " : item.label === "Flash Sale" ? "⚡ " : ""}{item.label}</Link>)}</nav>
      <div className="ml-auto hidden md:block md:w-56 lg:ml-0 lg:w-64"><SearchBox /></div>
      <div className="flex items-center gap-1.5">
        <Link to="/cart" className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"><ShoppingBag className="h-5 w-5 text-brand" /><span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-orange text-[10px] font-semibold text-white">{cartCount}</span></Link>
        <Link to="/wishlist" className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"><Heart className="h-5 w-5 text-brand" />{wishlistCount ? <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-orange text-[10px] font-semibold text-white">{wishlistCount}</span> : null}</Link>
        <div className="relative">{isAuthenticated ? <button onClick={() => setAccountOpen((value) => !value)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"><User className="h-5 w-5 text-brand" /></button> : <Link to="/login" className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"><User className="h-5 w-5 text-brand" /></Link>}
          {accountOpen && isAuthenticated ? <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-xl"><p className="border-b border-border px-3 py-2 text-xs text-muted-foreground">Logged in as<br /><strong className="text-foreground">{user?.username}</strong></p><AccountLink to="/profile" label="My Profile" /><AccountLink to="/addresses" label="My Addresses" /><AccountLink to="/orders" label="My Orders" /><button onClick={() => { logout(); setAccountOpen(false); }} className="mt-1 flex w-full items-center gap-2 border-t border-border px-3 py-3 text-left text-sm text-red-600"><LogOut className="h-4 w-4" /> Logout</button></div> : null}
        </div>
      </div>
    </div><div className="pb-2 md:hidden"><SearchBox /><div className="mt-2 flex gap-2 overflow-x-auto [scrollbar-width:none]">{navItems.map((item) => <Link key={item.to} to={item.to} className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs">{item.label}</Link>)}</div></div></div>
  </header><div aria-hidden className="h-[118px] md:h-14" /></>;
}

function SearchBox() {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm } = useShop();
  const [focused, setFocused] = useState(false);
  const suggestions = useQuery({
    queryKey: ["product-search-suggestions", searchTerm], enabled: focused && searchTerm.trim().length > 0,
    queryFn: async () => {
      const page = await api.products({ page: 0, size: 6, search: searchTerm.trim(), sortBy: "name", direction: "ASC" });
      return Promise.all(page.content.map(async (product) => { try { return { ...product, ...(await api.product(product.id)) }; } catch { return product; } }));
    },
  });
  const open = focused && searchTerm.trim().length > 0;
  return <div className="relative"><div className={`flex h-10 items-center gap-2 border border-border bg-secondary px-3 ${open ? "rounded-t-xl border-b-transparent" : "rounded-full"}`}><Search className="h-4 w-4 text-muted-foreground" /><input value={searchTerm} onFocus={() => setFocused(true)} onBlur={() => window.setTimeout(() => setFocused(false), 150)} onChange={(event) => setSearchTerm(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void navigate({ to: "/products" }); }} placeholder="Search products" className="w-full bg-transparent text-sm outline-none" /></div>
    {open ? <div className="absolute inset-x-0 top-full z-[70] max-h-96 overflow-y-auto rounded-b-xl border border-t-0 border-border bg-card shadow-xl">{suggestions.isLoading ? <p className="px-4 py-3 text-sm text-muted-foreground">Searching…</p> : null}{suggestions.data?.map((product) => <Link key={product.id} to="/products/$productId" params={{ productId: product.urlHandle || product.slug || String(product.id) }} className="flex items-center gap-3 border-t border-border px-3 py-2 hover:bg-secondary"><div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-secondary">{resolveApiImage(product.imagePath || product.variants?.[0]?.images?.[0]) ? <img src={resolveApiImage(product.imagePath || product.variants?.[0]?.images?.[0])} alt="" className="h-full w-full object-cover" /> : <span>{product.emoji || "□"}</span>}</div><div className="min-w-0"><p className="truncate text-sm font-medium">{product.name}</p><p className="text-xs text-muted-foreground">{product.brandName} · ₹{product.variantMinPrice || product.basePrice}</p></div></Link>)}{!suggestions.isLoading && !suggestions.data?.length ? <p className="px-4 py-3 text-sm text-muted-foreground">No products found</p> : null}<button onMouseDown={(event) => event.preventDefault()} onClick={() => void navigate({ to: "/products" })} className="w-full border-t border-border px-4 py-2 text-left text-xs font-medium text-brand">View all results</button></div> : null}
  </div>;
}

function AccountLink({ to, label }: { to: "/profile" | "/addresses" | "/orders"; label: string }) { return <Link to={to} className="block rounded-lg px-3 py-2.5 text-sm hover:bg-secondary">{label}</Link>; }
