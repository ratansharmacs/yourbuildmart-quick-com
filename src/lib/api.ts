const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (!configuredBaseUrl) {
  throw new Error("VITE_API_BASE_URL is not configured");
}

export const API_BASE_URL = configuredBaseUrl.replace(/\/+$/, "");
const API_REQUEST_TIMEOUT_MS = 15_000;

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PageResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type ImageMetadata = {
  path: string;
  originalName?: string;
};

export type CatalogProduct = {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  basePrice: number;
  variantMinPrice: number;
  variantMaxPrice: number;
  priceDisplay: string;
  emoji?: string;
  imagePath?: ImageMetadata | null;
  tags: string[];
  variantCount: number;
  inStock: boolean;
  createdDate: string;
  urlHandle: string;
  slug: string;
  variants?: ProductVariant[];
};

export type ProductVariant = {
  id: number;
  attrsCombo: string;
  sku: string;
  price: number;
  images: ImageMetadata[];
  inventory: {
    available: boolean;
    totalStock?: number | null;
    stockLabel: string;
    lowStockRemaining: number | null;
    maxCartQuantity: number | null;
  };
};

export type ProductDetail = CatalogProduct & {
  description: string;
  overview?: string | null;
  keyFeatures?: string | null;
  whatsInside?: string | null;
  howToUse?: string | null;
  featureBadges?: string[];
  seoTitle?: string;
  seoDescription?: string;
  attrs: Array<{ attributeName: string; values: string[]; displayOrder: number }>;
  variants: ProductVariant[];
  updatedDate: string;
};

export type CustomerCategory = {
  id: number;
  name: string;
  description: string;
  productCount: number;
  parentId: number | null;
  image: string;
  children: CustomerCategory[] | null;
};

export type CustomerBrand = {
  id: number;
  name: string;
  productCount: number;
  logoPath: string;
};

export type AuthResponse = {
  token: string;
  username: string;
  role: string;
  personId: number;
  tenantId: number;
  tenantType: string;
  permissions: Record<string, Record<string, boolean>>;
};

export type OtpPurpose = "LOGIN" | "FORGOT_PASSWORD";

export type OtpChallenge = {
  identifier?: string;
  purpose?: string;
  channel?: string;
  maskedDestination?: string;
  expiresAt?: string;
  resendAvailableAt?: string;
  message?: string;
  [key: string]: unknown;
};

export type CustomerProfile = {
  id: number;
  personId: number;
  customerCode: string;
  displayName: string;
  name?: string | null;
  email: string | null;
  mobile: string | null;
  emailVerified?: boolean;
  mobileVerified?: boolean;
  passwordSet?: boolean;
  passwordSetAt?: string | null;
  gstin: string | null;
  pan: string | null;
  creditLimit: number | null;
  paymentTermsDays: number | null;
  notes: string | null;
};

export type CustomerAddress = {
  id: number;
  customerProfileId: number;
  addressType: string;
  contactName: string;
  mobile: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  countryId?: number;
  isDefault: boolean;
};

export type AddressRequest = Omit<CustomerAddress, "id" | "customerProfileId">;

export type CartItem = {
  id: number;
  cartId: number;
  productId: number;
  variantId: number;
  batchId?: number;
  warehouseId?: number;
  sku: string;
  productName: string;
  brandName: string;
  variantLabel: string;
  imagePath: string;
  slug: string;
  unitPrice: number;
  quantity: number;
  maxQuantity: number;
  stockLabel: string;
};

export type Cart = {
  id: number;
  customerProfileId: number;
  itemCount: number;
  items: CartItem[];
};

export type CheckoutItem = {
  productId?: number;
  variantId: number;
  batchId?: number;
  quantity: number;
  unitPrice?: number;
  discountAmount?: number;
  taxAmount?: number;
};

export type SalesOrder = {
  id: number;
  orderNumber: string;
  status: string;
  orderDate: string;
  paymentMethod: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  grandTotal: number;
  remarks: string;
  items: Array<{
    id: number;
    productId: number;
    variantId: number;
    sku: string;
    productName: string;
    variantLabel: string;
    orderedQty: number;
    unitPrice: number;
    lineTotal: number;
  }>;
};

export type CheckoutPreview = {
  deliveryAddressId: number;
  postalCode: string;
  serviceable: boolean;
  message: string;
  orderCount: number;
  paymentMethod: string;
  subtotal: number;
  grandTotal: number;
  items: Array<CheckoutItem & { productName: string; lineTotal: number; serviceable: boolean; message: string }>;
};

export type CheckoutSession = {
  expiresAt: string;
  paymentMethod: string;
  totalAmount: number;
  orders: SalesOrder[];
};

export type BlogCatalog = {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  banner: string;
  categoryId: number;
  categoryName: string;
  createdDate: string;
  readingTime: number;
};

export type BlogDetail = BlogCatalog & {
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaImg: string;
  metaKeywords: string;
  updatedDate: string;
  author: string;
};

export type BlogCategory = {
  id: number;
  name: string;
  blogCount: number;
};

export type Testimonial = {
  id: number;
  customerName: string;
  customerImage: string | null;
  designation: string | null;
  company: string | null;
  content: string;
  rating: number;
  status: boolean;
  crtDt: string;
  updtDt: string | null;
};

function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("ybm_auth_token");
}

function toSearchParams(params: Record<string, unknown>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((entry) => search.append(key, String(entry)));
    } else {
      search.set(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : "";
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  { auth = false, raw = false }: { auth?: boolean; raw?: boolean } = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body) headers.set("Content-Type", "application/json");
  const token = getToken();
  if (auth && token) headers.set("Authorization", `Bearer ${token}`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_REQUEST_TIMEOUT_MS);
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("The API request timed out. Please try again.");
    }
    throw new Error(
      error instanceof Error
        ? `Unable to reach the API: ${error.message}`
        : "Unable to reach the API",
    );
  } finally {
    clearTimeout(timeout);
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : null;

  if (!response.ok) {
    if (auth && response.status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem("ybm_auth_token");
      window.localStorage.removeItem("ybm_auth");
      window.dispatchEvent(new Event("ybm-auth-expired"));
    }
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }
  if (!payload) {
    throw new Error("The API returned an invalid response");
  }
  if (raw) return payload as T;
  if (!payload?.success) throw new Error(payload?.message || "The request was not successful");
  return (payload as ApiResponse<T>).data;
}

function unwrapResponse<T>(payload: T | ApiResponse<T>) {
  if (
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    "data" in payload
  ) {
    return (payload as ApiResponse<T>).data;
  }
  return payload as T;
}

export function findDevelopmentOtp(value: unknown): string {
  if (!value || typeof value !== "object") return "";

  for (const [key, entry] of Object.entries(value)) {
    if (
      /^(otp|code|otpCode|verificationCode|debugOtp|testOtp|developmentOtp|devOtp)$/i.test(key) &&
      /^[0-9]{4,8}$/.test(String(entry))
    ) {
      return String(entry);
    }
    const nested = findDevelopmentOtp(entry);
    if (nested) return nested;
  }
  return "";
}

function extractImagePath(image?: string | ImageMetadata | null) {
  const value = typeof image === "string" ? image : image?.path;
  if (!value) return "";

  if (value.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(value) as ImageMetadata;
      return parsed.path || "";
    } catch {
      return "";
    }
  }

  return value;
}

export function resolveApiImage(image?: string | ImageMetadata | null) {
  const path = extractImagePath(image);
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  if (path.startsWith("/api/files/")) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/api/files/${path.replace(/^\/+/, "")}`;
}

export function getProductImages(product: ProductDetail) {
  const images = [
    resolveApiImage(product.imagePath),
    ...product.variants.flatMap((variant) =>
      variant.images.map((image) => resolveApiImage(image)),
    ),
  ].filter(Boolean);

  return [...new Set(images)];
}

export function parseVariantAttributes(combo: string) {
  return combo.split(",").reduce<Record<string, string>>((attributes, pair) => {
    const separator = pair.indexOf("=");
    if (separator === -1) return attributes;
    const name = pair.slice(0, separator).trim();
    const value = pair.slice(separator + 1).trim();
    if (name && value) attributes[name] = value;
    return attributes;
  }, {});
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const api = {
  passwordLogin: async (identifier: string, password: string) =>
    unwrapResponse(await request<AuthResponse | ApiResponse<AuthResponse>>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password, loginMethod: "PASSWORD" }),
    }, { raw: true })),
  requestOtp: async (identifier: string, purpose: OtpPurpose) =>
    unwrapResponse(await request<OtpChallenge | ApiResponse<OtpChallenge>>("/api/auth/otp/request", {
      method: "POST",
      body: JSON.stringify({ identifier, purpose }),
    }, { raw: true })),
  otpLogin: async (identifier: string, otp: string) =>
    unwrapResponse(await request<AuthResponse | ApiResponse<AuthResponse>>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, otp, loginMethod: "OTP" }),
    }, { raw: true })),
  resetForgotPassword: async (identifier: string, otp: string, newPassword: string) =>
    unwrapResponse(await request<{ message?: string } | ApiResponse<{ message?: string }>>("/api/auth/password/forgot/reset", {
      method: "POST",
      body: JSON.stringify({ identifier, otp, newPassword }),
    }, { raw: true })),

  products: (params: Record<string, unknown> = {}) =>
    request<PageResponse<CatalogProduct>>(`/api/customer/products${toSearchParams(params)}`),
  featuredProducts: (params: Record<string, unknown> = {}) =>
    request<PageResponse<CatalogProduct>>(`/api/customer/products/featured${toSearchParams(params)}`),
  hotDealProducts: (params: Record<string, unknown> = {}) =>
    request<PageResponse<CatalogProduct>>(`/api/customer/products/hot-deals${toSearchParams(params)}`),
  product: (id: number | string) => request<ProductDetail>(`/api/customer/products/${id}`),
  productBySlug: (slug: string) => request<ProductDetail>(`/api/customer/products/slug/${encodeURIComponent(slug)}`),
  productsByCategory: (id: number, params: Record<string, unknown> = {}) =>
    request<PageResponse<CatalogProduct>>(`/api/customer/products/category/${id}${toSearchParams(params)}`),
  productsByBrand: (id: number, params: Record<string, unknown> = {}) =>
    request<PageResponse<CatalogProduct>>(`/api/customer/products/brand/${id}${toSearchParams(params)}`),
  relatedProducts: (id: number | string, page = 0, size = 6) =>
    request<PageResponse<CatalogProduct>>(`/api/customer/products/${id}/related${toSearchParams({ page, size })}`),
  testimonials: (params: Record<string, unknown> = {}) =>
    request<PageResponse<Testimonial>>(`/api/customer/testimonials${toSearchParams(params)}`),

  categories: () => request<CustomerCategory[]>("/api/customer/categories"),
  categoryTree: () => request<CustomerCategory[]>("/api/customer/categories/tree"),
  category: (id: number) => request<CustomerCategory>(`/api/customer/categories/${id}`),
  brands: () => request<CustomerBrand[]>("/api/customer/brands"),
  featuredBrands: () => request<CustomerBrand[]>("/api/customer/brands/featured"),
  verifiedBrands: () => request<CustomerBrand[]>("/api/customer/brands/verified"),
  brand: (id: number) => request<CustomerBrand>(`/api/customer/brands/${id}`),

  blogs: (params: Record<string, unknown> = {}) =>
    request<PageResponse<BlogCatalog>>(`/api/customer/blogs${toSearchParams(params)}`),
  blog: (slug: string) => request<BlogDetail>(`/api/customer/blogs/${encodeURIComponent(slug)}`),
  blogCategories: () => request<BlogCategory[]>("/api/customer/blogs/categories"),
  blogsByCategory: (id: number, page = 0, size = 20) =>
    request<PageResponse<BlogCatalog>>(`/api/customer/blogs/category/${id}${toSearchParams({ page, size })}`),
  relatedBlogs: (slug: string, page = 0, size = 5) =>
    request<PageResponse<BlogCatalog>>(`/api/customer/blogs/${encodeURIComponent(slug)}/related${toSearchParams({ page, size })}`),
  blogSuggestions: (q: string, limit = 10) =>
    request<string[]>(`/api/customer/blogs/search-suggestions${toSearchParams({ q, limit })}`),

  profile: () => request<CustomerProfile>("/api/customer-account/profile", {}, { auth: true }),
  updateProfile: (body: Partial<CustomerProfile>) =>
    request<CustomerProfile>("/api/customer-account/profile", { method: "PUT", body: JSON.stringify(body) }, { auth: true }),
  updateBasicProfile: (body: {
    name: string;
    email?: string;
    emailOtp?: string;
    mobile?: string;
    mobileOtp?: string;
  }) =>
    request<CustomerProfile>("/api/customer-account/profile/basic", {
      method: "PUT",
      body: JSON.stringify(body),
    }, { auth: true }),
  requestContactOtp: async (
    identifier: string,
    purpose: "CHANGE_EMAIL" | "CHANGE_MOBILE",
  ) =>
    unwrapResponse(await request<OtpChallenge | ApiResponse<OtpChallenge>>("/api/customer-account/security/contact-otp", {
      method: "POST",
      body: JSON.stringify({ identifier, purpose }),
    }, { auth: true, raw: true })),
  updatePassword: (newPassword: string, currentPassword?: string) =>
    request<{ message?: string }>("/api/customer-account/security/password", {
      method: "POST",
      body: JSON.stringify({
        ...(currentPassword ? { currentPassword } : {}),
        newPassword,
      }),
    }, { auth: true }),
  addresses: () => request<CustomerAddress[]>("/api/customer-account/addresses", {}, { auth: true }),
  createAddress: (body: AddressRequest) =>
    request<CustomerAddress>("/api/customer-account/addresses", { method: "POST", body: JSON.stringify(body) }, { auth: true }),
  updateAddress: (id: number, body: AddressRequest) =>
    request<CustomerAddress>(`/api/customer-account/addresses/${id}`, { method: "PUT", body: JSON.stringify(body) }, { auth: true }),
  deleteAddress: (id: number) =>
    request<void>(`/api/customer-account/addresses/${id}`, { method: "DELETE" }, { auth: true }),

  cart: () => request<Cart>("/api/customer-account/cart", {}, { auth: true }),
  addCartItem: (variantId: number, quantity: number) =>
    request<CartItem>("/api/customer-account/cart/items", {
      method: "POST",
      body: JSON.stringify({ variantId, quantity }),
    }, { auth: true }),
  updateCartItem: (itemId: number, quantity: number, warehouseId?: number) =>
    request<CartItem>(`/api/customer-account/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity, warehouseId }),
    }, { auth: true }),
  removeCartItem: (itemId: number) =>
    request<void>(`/api/customer-account/cart/items/${itemId}`, { method: "DELETE" }, { auth: true }),
  clearCart: () => request<void>("/api/customer-account/cart", { method: "DELETE" }, { auth: true }),

  orders: (params: Record<string, unknown> = {}) =>
    request<PageResponse<SalesOrder>>(`/api/customer-account/orders${toSearchParams(params)}`, {}, { auth: true }),
  order: (id: number) => request<SalesOrder>(`/api/customer-account/orders/${id}`, {}, { auth: true }),
  createOrder: (body: Record<string, unknown>) =>
    request<SalesOrder>("/api/customer-account/orders", { method: "POST", body: JSON.stringify(body) }, { auth: true }),
  checkoutPreview: (deliveryAddressId: number, items: CheckoutItem[], remarks = "") =>
    request<CheckoutPreview>("/api/customer-account/orders/payment-session/preview", {
      method: "POST",
      body: JSON.stringify({ deliveryAddressId, items, remarks }),
    }, { auth: true }),
  startCheckout: (deliveryAddressId: number, items: CheckoutItem[], remarks = "") =>
    request<CheckoutSession>("/api/customer-account/orders/payment-session", {
      method: "POST",
      body: JSON.stringify({ deliveryAddressId, items, remarks }),
    }, { auth: true }),
  confirmCheckout: (orderIds: number[], paymentMethod: string) =>
    request<CheckoutSession>("/api/customer-account/orders/payment-session/confirm", {
      method: "POST",
      body: JSON.stringify({ orderIds, paymentMethod }),
    }, { auth: true }),

  contact: (body: { name: string; email: string; message: string }) =>
    request<{ id: number }>("/api/contact", { method: "POST", body: JSON.stringify(body) }),
};
