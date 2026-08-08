import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ChevronDown, Heart, HelpCircle, LogOut, MapPin, Phone, Search, ShieldCheck, ShoppingBag, Truck, User, WalletCards } from "lucide-react";
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
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(8);
  useEffect(() => {
    const updateVisibleCategories = () => {
      const width = window.innerWidth;
      setVisibleCategoryCount(width >= 1500 ? 8 : width >= 1280 ? 7 : width >= 1080 ? 5 : 3);
    };
    updateVisibleCategories();
    window.addEventListener("resize", updateVisibleCategories);
    return () => window.removeEventListener("resize", updateVisibleCategories);
  }, []);
  const visibleCategories = topLevelCategories.slice(0, visibleCategoryCount);
  const overflowCategories = topLevelCategories.slice(visibleCategoryCount);
  return <>
    <header className={`fixed inset-x-0 top-0 z-[100] bg-gradient-to-r from-white via-[#FFF5EA] to-[#FFE7C7] shadow-sm ${className || ""}`}>
      <div className="hidden h-10 bg-brand text-xs text-white md:block">
        <div className="container-page flex h-full items-center justify-between gap-5">
          <div className="flex items-center gap-5 lg:gap-8"><TopBarItem icon={ShieldCheck} label="100% Genuine Products" /><TopBarItem icon={Truck} label="Fast & Reliable Delivery" /><TopBarItem icon={WalletCards} label="Pay on Delivery" /></div>
          <div className="flex items-center gap-5 lg:gap-7">
            <button type="button" onClick={changePincode} className="flex items-center gap-1.5 hover:text-white/80"><MapPin className="h-4 w-4" />{pincode ? `Deliver to ${pincode}` : "Choose delivery pincode"}<ChevronDown className="h-3.5 w-3.5" /></button>
            <Link to="/orders" className="hover:text-white/80">Track Order</Link><Link to="/faqs" className="flex items-center gap-1.5 hover:text-white/80"><HelpCircle className="h-4 w-4" />Help Center</Link><a href="tel:+918383001449" className="flex items-center gap-1.5 hover:text-white/80"><Phone className="h-4 w-4" />+91 83830 01449</a>
          </div>
        </div>
      </div>
      {/* Top bar: logo, large search, account/cart */}
      <div className="container-page">
        <div className="flex h-16 items-center gap-1 sm:gap-4 md:h-[92px]">
          <Link to="/" className="shrink-0"><Logo /></Link>
          <div className="hidden min-w-0 max-w-[960px] flex-1 md:block">
            <SearchBox large />
          </div>
          <div className="ml-auto flex items-center gap-0 sm:gap-2">
            <button
              type="button"
              onClick={changePincode}
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-brand hover:bg-secondary sm:flex"
              aria-label={pincode ? `Delivery pincode ${pincode}. Change pincode` : "Choose delivery pincode"}
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden flex-col items-start leading-tight lg:flex"><span className="text-[10px] font-normal text-muted-foreground">Deliver to</span><span>{pincode || "Pincode"}</span></span>
            </button>
            <div className="relative">
              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={() => setAccountOpen((open) => !open)}
                    className="flex min-w-14 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 hover:bg-secondary/80"
                    aria-label="Open account menu"
                    aria-expanded={accountOpen}
                  >
                    <User className="h-5 w-5 text-brand" />
                    <span className="hidden text-[10px] font-medium text-brand lg:block">Account</span>
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
                  className="flex min-w-14 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 hover:bg-secondary"
                  aria-label="Log in"
                >
                  <User className="h-5 w-5 text-brand" />
                  <span className="hidden text-[10px] font-medium text-brand lg:block">Sign In</span>
                </Link>
              )}
            </div>
            <Link to="/wishlist" className="relative flex min-w-14 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 hover:bg-secondary"><Heart className="h-5 w-5 text-brand" /><span className="hidden text-[10px] font-medium text-brand lg:block">Wishlist</span>{wishlistCount ? <span className="absolute right-1 top-0 grid h-4 w-4 place-items-center rounded-full bg-orange text-[10px] font-semibold text-white">{wishlistCount}</span> : null}</Link>
            <Link to="/cart" className="relative flex min-w-14 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 hover:bg-secondary"><ShoppingBag className="h-5 w-5 text-brand" /><span className="hidden text-[10px] font-medium text-brand lg:block">Cart</span><span className="absolute right-1 top-0 grid h-4 w-4 place-items-center rounded-full bg-orange text-[10px] font-semibold text-white">{cartCount}</span></Link>
          </div>
        </div>
      </div>

      {/* Secondary category nav (gradient) */}
      <div className="mt-0 w-full border-t border-border bg-gradient-to-r from-white via-[#FFF5EA] to-[#FFE7C7]">
        <div className="container-page">
          <nav className="hidden h-12 w-full items-center justify-between gap-5 text-base md:flex">
            <Link to="/hot-deals" className="shrink-0 font-semibold text-orange">🔥 Hot Deals</Link>
            {visibleCategories.map((item) => (
              <CategoryMenu
                key={item.id}
                category={item}
                subcategories={categories.filter((category) => category.parentId === item.id)}
              />
            ))}
            {overflowCategories.length ? <MoreCategories categories={overflowCategories} allCategories={categories} /> : null}
          </nav>
        </div>
      </div>
    </header>
    {/* Spacer to offset fixed header (top + secondary). Adjust if header heights change */}
    <div aria-hidden className="h-16 md:h-[180px]" />
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

function MoreCategories({
  categories,
  allCategories,
}: {
  categories: CustomerCategory[];
  allCategories: CustomerCategory[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex h-12 shrink-0 items-center">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex items-center gap-1.5 font-medium text-foreground/80 transition-colors hover:text-orange" aria-expanded={open} aria-haspopup="menu">
        More <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <>
          <button type="button" aria-label="Close more categories" className="fixed inset-0 z-[108] cursor-default" onClick={() => setOpen(false)} />
          <div role="menu" className="absolute right-0 top-full z-[109] max-h-[70vh] w-72 overflow-y-auto rounded-b-xl border border-orange/15 bg-gradient-to-b from-[#FFF8EF] to-[#FFE7C7] p-2 shadow-xl">
            {categories.map((category) => {
              const children = allCategories.filter((item) => item.parentId === category.id);
              return (
                <div key={category.id} className="border-b border-orange/10 py-1 last:border-0">
                  <Link to="/category/$categoryId" params={{ categoryId: slugify(category.name) }} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-brand hover:bg-orange hover:text-white" role="menuitem">{category.name}</Link>
                  {children.map((child) => <Link key={child.id} to="/subcategory/$subcategoryId" params={{ subcategoryId: slugify(child.name) }} onClick={() => setOpen(false)} className="block rounded-lg py-1.5 pl-6 pr-3 text-xs text-foreground/75 hover:bg-orange hover:text-white" role="menuitem">{child.name}</Link>)}
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}

function SearchBox({ large }: { large?: boolean } = { large: false }) {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm } = useShop();
  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: api.categories });
  const categories = categoriesQuery.data || [];
  const [selectedCategory, setSelectedCategory] = useState<CustomerCategory | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const suggestions = useQuery({
    queryKey: ["product-search-suggestions", searchTerm, selectedCategory?.id], enabled: focused && searchTerm.trim().length > 0,
    queryFn: async () => {
      const params = { page: 0, size: 6, search: searchTerm.trim(), sortBy: "name", direction: "ASC" };
      const page = selectedCategory ? await api.productsByCategory(selectedCategory.id, params) : await api.products(params);
      return Promise.all(page.content.map(async (product) => { try { return { ...product, ...(await api.product(product.id)) }; } catch { return product; } }));
    },
  });
  const open = focused && searchTerm.trim().length > 0;
  const goToResults = () => selectedCategory
    ? navigate({ to: selectedCategory.parentId === null ? "/category/$categoryId" : "/subcategory/$subcategoryId", params: selectedCategory.parentId === null ? { categoryId: slugify(selectedCategory.name) } : { subcategoryId: slugify(selectedCategory.name) } } as never)
    : navigate({ to: "/products" });
  return <div className="relative"><div className={`flex items-center border border-border bg-secondary ${open ? "rounded-t-2xl border-b-transparent" : "rounded-full"} ${large ? "h-12" : "h-10"}`}>
    <div className="relative h-full shrink-0"><button type="button" onClick={() => setCategoryOpen((value) => !value)} className="flex h-full max-w-44 items-center gap-2 rounded-l-full border-r border-border px-4 text-sm font-medium" aria-expanded={categoryOpen}>{selectedCategory?.name || "All Categories"}<ChevronDown className="h-4 w-4 shrink-0" /></button>
      {categoryOpen ? <div className="absolute left-0 top-full z-[90] mt-1 max-h-80 w-72 overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-xl"><button type="button" onClick={() => { setSelectedCategory(null); setCategoryOpen(false); }} className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-secondary">All Categories</button>{categories.filter((item) => item.parentId === null).map((parent) => <div key={parent.id}><button type="button" onClick={() => { setSelectedCategory(parent); setCategoryOpen(false); }} className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-brand hover:bg-secondary">{parent.name}</button>{categories.filter((item) => item.parentId === parent.id).map((child) => <button key={child.id} type="button" onClick={() => { setSelectedCategory(child); setCategoryOpen(false); }} className="w-full rounded-lg py-2 pl-7 pr-3 text-left text-sm text-foreground/75 hover:bg-secondary">{child.name}</button>)}</div>)}{categoriesQuery.isLoading ? <p className="px-3 py-2 text-sm text-muted-foreground">Loading categories...</p> : null}</div> : null}
    </div>
    <input value={searchTerm} onFocus={() => setFocused(true)} onBlur={() => window.setTimeout(() => setFocused(false), 150)} onChange={(event) => setSearchTerm(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void goToResults(); }} placeholder="Search products, brands and more..." className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none" /><button type="button" onClick={() => void goToResults()} aria-label="Search" className="mr-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange text-white"><Search className="h-5 w-5" /></button></div>
    {open ? <div className="absolute inset-x-0 top-full z-[70] max-h-96 overflow-y-auto rounded-b-xl border border-t-0 border-border bg-card shadow-xl">{suggestions.isLoading ? <p className="px-4 py-3 text-sm text-muted-foreground">Searching…</p> : null}{suggestions.data?.map((product) => <Link key={product.id} to="/products/$productId" params={{ productId: product.urlHandle || product.slug || String(product.id) }} className="flex items-center gap-3 border-t border-border px-3 py-2 hover:bg-secondary"><div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-secondary">{resolveApiImage(product.imagePath || product.variants?.[0]?.images?.[0]) ? <img src={resolveApiImage(product.imagePath || product.variants?.[0]?.images?.[0])} alt="" className="h-full w-full object-cover" /> : <span>{product.emoji || "□"}</span>}</div><div className="min-w-0"><p className="truncate text-sm font-medium">{product.name}</p><p className="text-xs text-muted-foreground">{product.brandName} · ₹{product.variantMinPrice || product.basePrice}</p></div></Link>)}{!suggestions.isLoading && !suggestions.data?.length ? <p className="px-4 py-3 text-sm text-muted-foreground">No products found</p> : null}<button onMouseDown={(event) => event.preventDefault()} onClick={() => void navigate({ to: "/products" })} className="w-full border-t border-border px-4 py-2 text-left text-xs font-medium text-brand">View all results</button></div> : null}
  </div>;
}

function TopBarItem({ icon: Icon, label }: { icon: typeof ShieldCheck; label: string }) { return <span className="flex items-center gap-2"><Icon className="h-4 w-4" />{label}</span>; }

function AccountLink({ to, label }: { to: "/profile" | "/addresses" | "/orders"; label: string }) { return <Link to={to} className="block rounded-lg px-3 py-2.5 text-sm hover:bg-secondary">{label}</Link>; }
