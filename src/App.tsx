import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "@tanstack/react-router";
import { ShopProvider } from "@/context/shop-context";
import { AuthProvider } from "@/context/auth-context";
import { PincodeProvider } from "@/context/pincode-context";

export function App({ queryClient }: { queryClient: QueryClient }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PincodeProvider>
        <AuthProvider>
          <ShopProvider>
            <Outlet />
          </ShopProvider>
        </AuthProvider>
      </PincodeProvider>
    </QueryClientProvider>
  );
}
