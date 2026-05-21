import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Heart, ShoppingBag, User } from "lucide-react";
import { Logo } from "./Logo";
import { useShop } from "@/context/shop-context";

const navItems = [
  { to: "/", label: "Hot Deals", icon: true },
  { to: "/products", label: "Cement & Concrete" },
  { to: "/products", label: "Hardware" },
  { to: "/products", label: "Electrical" },
  { to: "/products", label: "Plumbing" },
  { to: "/products", label: "Flash Sale", icon: true },
];

export function Navbar() {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, cartCount } = useShop();

  const onSearchSubmit = () => {
    navigate({ to: "/products" });
  };

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 overflow-x-clip border-b border-border backdrop-blur"
        style={{
          background: "linear-gradient(90deg, #FFFFFF 0%, #FAEDE1 100%)",
        }}
      >
        <div className="container-page py-0">
        <div className="pb-1 pt-1 md:hidden">
          <div className="leading-tight text-muted-foreground">
            <p className="text-[10px] font-medium text-foreground">Delivery in 8 minutes</p>
            <p className="text-[10px]">BCC &amp; Rajajipuram, Lucknow Division</p>
          </div>
        </div>

        <div className="flex h-12 min-w-0 items-center gap-3 md:h-14 md:gap-6">
          <Link to="/" className="shrink-0"><Logo /></Link>

          <nav className="hidden flex-1 items-center justify-between px-6 lg:flex xl:px-8">
            {navItems.map((n, i) => (
              <Link
                key={i}
                to={n.to}
                className={`flex items-center gap-1 text-sm transition hover:text-brand ${
                  n.label === "Hot Deals"
                    ? "text-[#EA8429]"
                    : n.label === "Flash Sale"
                      ? "font-medium text-[#EA8429]"
                      : "text-foreground/80"
                }`}
                activeProps={{ className: "text-brand font-semibold" }}
              >
                {n.label === "Hot Deals" && <span className="text-xs text-[#EA8429]">🔥</span>}
                {n.label === "Flash Sale" && <span className="text-xs text-[#EA8429]">⚡</span>}
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 md:flex md:w-52 lg:w-56">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearchSubmit();
              }}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="ml-auto flex items-center gap-1.5 md:ml-0 md:gap-2">
            <Link to="/cart" className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-secondary">
              <ShoppingBag className="h-5 w-5 text-brand" />
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-orange text-[10px] font-semibold text-orange-foreground">{cartCount}</span>
            </Link>
            <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary">
              <Heart className="h-5 w-5 text-brand" />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary">
              <User className="h-5 w-5 text-brand" />
            </button>
          </div>
        </div>

        <div className="pb-2 md:hidden">
          <div className="mb-2 flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearchSubmit();
              }}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-xs ${
                  n.label === "Flash Sale"
                    ? "border-orange/30 bg-orange/10 text-orange"
                    : "border-border bg-card text-foreground"
                }`}
              >
                {n.label === "Hot Deals" && <span className="text-[10px] text-[#EA8429]">🔥</span>}
                {n.label === "Flash Sale" && <span className="text-[10px] text-[#EA8429]">⚡</span>}
                {n.label}
              </Link>
            ))}
          </div>
        </div>
        </div>
      </header>
      <div aria-hidden className="h-[176px] md:h-14" />
    </>
  );
}
