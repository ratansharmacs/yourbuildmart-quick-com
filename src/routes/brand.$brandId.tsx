import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { ProductCard } from "@/components/site/ProductCard";
import { api, resolveApiImage } from "@/lib/api";
import { catalogProductToCard } from "@/lib/product-adapter";

export const Route = createFileRoute("/brand/$brandId")({ component: BrandProductsPage });
function BrandProductsPage() {
  const id = Number(Route.useParams().brandId);
  const brand = useQuery({ queryKey: ["brand", id], queryFn: () => api.brand(id) });
  const products = useQuery({ queryKey: ["brand-products", id], queryFn: () => api.productsByBrand(id, { page: 0, size: 48, sortBy: "crtDt", direction: "DESC" }) });
  return <div className="flex min-h-screen flex-col"><Navbar /><main className="container-page flex-1 py-10"><div className="flex items-center gap-4">{brand.data?.logoPath ? <img src={resolveApiImage(brand.data.logoPath)} alt="" className="h-16 w-16 object-contain" /> : null}<div><p className="text-sm text-brand">Shop by brand</p><h1 className="text-4xl">{brand.data?.name || "Brand Products"}</h1></div></div>{products.isLoading ? <p className="mt-8">Loading products...</p> : null}<div className="mt-8 flex flex-wrap justify-center gap-5">{products.data?.content.map((p) => <div key={p.id} className="w-[calc(50%-0.625rem)] md:w-[calc(25%-0.938rem)]"><ProductCard product={catalogProductToCard(p)} /></div>)}</div>{products.isError ? <p className="mt-8 text-red-600">{products.error.message}</p> : null}</main><Footer /></div>;
}
