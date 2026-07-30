import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Heart, LogOut, MapPin, Search, ShoppingBag, User } from "lucide-react";
import { Logo } from "./Logo";
import { useShop } from "@/context/shop-context";
import { useAuth } from "@/context/auth-context";
import { api, resolveApiImage, slugify, type CustomerCategory } from "@/lib/api";
import { usePincode } from "@/context/pincode-context";

// Top-level nav will be populated from categories API (parentId === null)

export function Navbar({ className }: { className?: string }) {
  const navigate = useNavigate();
  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: api.categories });
  const categories = categoriesQuery.data || [];
  const topLevelCategories = categories.filter((category) => category.parentId === null);
  const { cartCount, wishlistCount } = useShop();
  const { isAuthenticated, user, logout } = useAuth();
  const { pincode, changePincode } = usePincode();
  const [accountOpen, setAccountOpen] = useState(false);
  return <>
    <header className={`fixed inset-x-0 top-0 z-[100] bg-gradient-to-r from-white via-[#FFF5EA] to-[#FFE7C7] ${className || ""}`}>
      {/* Top bar: logo, large search, account/cart */}
      <div className="container-page">
        <div className="flex h-16 items-center gap-4">
          <Link to="/" className="shrink-0"><Logo /></Link>
          <div className="flex-1 hidden md:block">
            <SearchBox large />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={changePincode}
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-brand hover:bg-secondary sm:flex"
              aria-label={`Delivery pincode ${pincode}. Change pincode`}
            >
              <MapPin className="h-4 w-4" />
              {pincode}
            </button>
            <div className="relative">
              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={() => setAccountOpen((open) => !open)}
                    className="grid h-10 w-10 place-items-center rounded-full bg-secondary hover:bg-secondary/80"
                    aria-label="Open account menu"
                    aria-expanded={accountOpen}
                  >
                    <User className="h-5 w-5 text-brand" />
                  </button>
                  {accountOpen ? (
                    <>
                      <button
                        type="button"
                        aria-label="Close account menu"
                        className="fixed inset-0 z-[101] cursor-default"
                        onClick={() => setAccountOpen(false)}
                      />
                      <div className="absolute right-0 top-12 z-[102] w-56 rounded-2xl border border-border bg-card p-2 shadow-xl">
                        <div className="border-b border-border px-3 py-2">
                          <p className="text-xs text-muted-foreground">Signed in as</p>
                          <p className="truncate text-sm font-semibold text-foreground">
                            {user?.username || "Your account"}
                          </p>
                        </div>
                        <div className="py-1" onClick={() => setAccountOpen(false)}>
                          <AccountLink to="/profile" label="My profile" />
                          <AccountLink to="/addresses" label="Saved addresses" />
                          <AccountLink to="/orders" label="My orders" />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setAccountOpen(false);
                            void navigate({ to: "/" });
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Log out
                        </button>
                      </div>
                    </>
                  ) : null}
                </>
              ) : (
                <Link
                  to="/login"
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"
                  aria-label="Log in"
                >
                  <User className="h-5 w-5 text-brand" />
                </Link>
              )}
            </div>
            <Link to="/wishlist" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"><Heart className="h-5 w-5 text-brand" />{wishlistCount ? <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-orange text-[10px] font-semibold text-white">{wishlistCount}</span> : null}</Link>
            <Link to="/cart" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"><ShoppingBag className="h-5 w-5 text-brand" /><span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-orange text-[10px] font-semibold text-white">{cartCount}</span></Link>
          </div>
        </div>
      </div>

      {/* Secondary category nav (gradient) */}
      <div className="mt-0 w-full border-t border-border bg-gradient-to-r from-white via-[#FFF5EA] to-[#FFE7C7]">
        <div className="px-[70px]">
          <nav className="hidden min-w-full items-center justify-center gap-8 text-base md:flex">
            <Link to="/hot-deals" className="font-semibold text-orange">🔥 Hot Deals</Link>
            {topLevelCategories.map((item) => (
              <CategoryMenu
                key={item.id}
                category={item}
                subcategories={categories.filter((category) => category.parentId === item.id)}
              />
            ))}
          </nav>
        </div>
      </div>
    </header>
    {/* Spacer to offset fixed header (top + secondary). Adjust if header heights change */}
    <div aria-hidden className="h-[118px]" />
  </>;
}

function CategoryMenu({
  category,
  subcategories,
}: {
  category: CustomerCategory;
  subcategories: CustomerCategory[];
}) {
  return (
    <div className="group/category relative flex h-12 items-center">
      <Link
        to="/category/$categoryId"
        params={{ categoryId: slugify(category.name) }}
        className="text-base text-foreground/80 transition-colors hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/40"
      >
        {category.name}
      </Link>
      {subcategories.length ? (
        <div className="pointer-events-none absolute left-0 top-full z-[110] w-max min-w-full max-w-72 translate-y-1 pt-1 opacity-0 transition duration-200 ease-out group-hover/category:pointer-events-auto group-hover/category:translate-y-0 group-hover/category:opacity-100 group-focus-within/category:pointer-events-auto group-focus-within/category:translate-y-0 group-focus-within/category:opacity-100">
          <div className="w-full overflow-hidden rounded-b-xl border border-orange/15 bg-gradient-to-b from-[#FFF8EF] to-[#FFE7C7] py-1.5 shadow-xl">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                to="/subcategory/$subcategoryId"
                params={{ subcategoryId: slugify(subcategory.name) }}
                className="line-clamp-3 w-full whitespace-normal px-3 py-2 text-[13px] leading-[1.35rem] text-foreground/80 [overflow-wrap:normal] [word-break:normal] transition-colors hover:bg-orange hover:text-white focus:bg-orange focus:text-white focus:outline-none"
              >
                {subcategory.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SearchBox({ large }: { large?: boolean } = { large: false }) {
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
  return <div className="relative"><div className={`flex items-center gap-2 border border-border bg-secondary px-3 ${open ? "rounded-t-xl border-b-transparent" : "rounded-full"} ${large ? "h-12" : "h-10"} ${large ? "text-sm" : "text-sm"}`}><Search className="h-4 w-4 text-muted-foreground" /><input value={searchTerm} onFocus={() => setFocused(true)} onBlur={() => window.setTimeout(() => setFocused(false), 150)} onChange={(event) => setSearchTerm(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void navigate({ to: "/products" }); }} placeholder="Search products" className="w-full bg-transparent text-sm outline-none" /></div>
    {open ? <div className="absolute inset-x-0 top-full z-[70] max-h-96 overflow-y-auto rounded-b-xl border border-t-0 border-border bg-card shadow-xl">{suggestions.isLoading ? <p className="px-4 py-3 text-sm text-muted-foreground">Searching…</p> : null}{suggestions.data?.map((product) => <Link key={product.id} to="/products/$productId" params={{ productId: product.urlHandle || product.slug || String(product.id) }} className="flex items-center gap-3 border-t border-border px-3 py-2 hover:bg-secondary"><div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-secondary">{resolveApiImage(product.imagePath || product.variants?.[0]?.images?.[0]) ? <img src={resolveApiImage(product.imagePath || product.variants?.[0]?.images?.[0])} alt="" className="h-full w-full object-cover" /> : <span>{product.emoji || "□"}</span>}</div><div className="min-w-0"><p className="truncate text-sm font-medium">{product.name}</p><p className="text-xs text-muted-foreground">{product.brandName} · ₹{product.variantMinPrice || product.basePrice}</p></div></Link>)}{!suggestions.isLoading && !suggestions.data?.length ? <p className="px-4 py-3 text-sm text-muted-foreground">No products found</p> : null}<button onMouseDown={(event) => event.preventDefault()} onClick={() => void navigate({ to: "/products" })} className="w-full border-t border-border px-4 py-2 text-left text-xs font-medium text-brand">View all results</button></div> : null}
  </div>;
}

function AccountLink({ to, label }: { to: "/profile" | "/addresses" | "/orders"; label: string }) { return <Link to={to} className="block rounded-lg px-3 py-2.5 text-sm hover:bg-secondary">{label}</Link>; }
