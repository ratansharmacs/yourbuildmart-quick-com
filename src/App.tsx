import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "@tanstack/react-router";
import { ShopProvider } from "@/context/shop-context";

export function App({ queryClient }: { queryClient: QueryClient }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ShopProvider>
        <Outlet />
      </ShopProvider>
    </QueryClientProvider>
  );
}
