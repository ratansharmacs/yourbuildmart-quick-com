import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "@tanstack/react-router";
import { ShopProvider } from "@/context/shop-context";
import { AuthProvider } from "@/context/auth-context";

export function App({ queryClient }: { queryClient: QueryClient }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ShopProvider>
          <Outlet />
        </ShopProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
