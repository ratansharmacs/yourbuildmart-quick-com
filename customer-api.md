# Customer API Documentation (Frontend Integration Guide)

## 1. Purpose of this document

This document covers all customer-related APIs in `wms-backend` that are required by `customer-frontend`.

It explains:
- What each API is used for
- Endpoint, method, auth requirement
- Request payload and query params
- Response structure
- Common frontend usage flow

---

## 2. Base URL and auth

Base URL:
- Local: `/api`
- Example full URL: `http://localhost:8080/api`

Authentication header (for protected customer account APIs):
- `Authorization: Bearer <jwt-token>`

Public APIs (no token required):
- `/api/auth/**`
- `/api/customer/products/**`
- `/api/customer/categories/**`
- `/api/customer/brands/**`
- `/api/customer/blogs/**`

Protected APIs (token required):
- `/api/customer-account/**`

---

## 3. Common response formats

### 3.1 Standard wrapper (`ApiResponse<T>`)

Most APIs return:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

Fields:
- `success` (boolean)
- `message` (string)
- `data` (object | array | page | null)

### 3.2 Auth login response (special case)

`POST /api/auth/login` returns `AuthResponse` directly (not wrapped by `ApiResponse`):

```json
{
  "token": "jwt-token",
  "username": "ABC Traders",
  "role": "ROLE_CUSTOMER",
  "personId": 25,
  "tenantId": 25,
  "tenantType": "CUSTOMER",
  "permissions": {
    "SALES_ORDERS": {
      "VIEW": true,
      "ADD": true,
      "EDIT": true
    }
  }
}
```

### 3.3 Paginated response (`PageResponse<T>`)

Paginated APIs return `data` in this format:

```json
{
  "content": [],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 12,
    "offset": 0,
    "paged": true,
    "unpaged": false,
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    }
  },
  "last": false,
  "totalPages": 10,
  "totalElements": 120,
  "size": 12,
  "number": 0,
  "sort": {
    "empty": false,
    "sorted": true,
    "unsorted": false
  },
  "first": true,
  "numberOfElements": 12,
  "empty": false
}
```

### 3.4 Error format

Most global errors return:

```json
{
  "error": "BAD_REQUEST",
  "message": "Validation failed",
  "status": 400,
  "timestamp": "2026-04-12 12:30:00"
}
```

---

## 4. Authentication API

### 4.1 Login customer/admin

- Method: `POST`
- Endpoint: `/api/auth/login`
- Auth required: No
- Purpose: Authenticate user and return JWT token + role/tenant info.

Request body:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `username` | string | Yes | Login username |
| `password` | string | Yes | Login password |

Example request:

```json
{
  "username": "customer01",
  "password": "secret123"
}
```

Success response (`200`): `AuthResponse` object (see section 3.2).

Common error cases:
- `400` missing username/password
- `401` invalid credentials
- `429` too many failed attempts from same IP

Frontend usage:
- Call login
- Save token in local storage
- Send token in `Authorization` header for all `/customer-account/*` APIs

### 4.2 Signup customer

- Method: `POST`
- Endpoint: `/api/customer-auth/signup`
- Auth required: No
- Purpose: Create new customer account.

Request body:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | Yes | Customer name |
| `email` | string | Yes | Email address |
| `mobile` | string | Yes | Mobile phone number |
| `password` | string | Yes | Login password |

Example request:

```json
{
  "name": "Ratan Sharma",
  "email": "ratan@example.com",
  "mobile": "9876543210",
  "password": "Secret@123"
}
```

Success response (`201`):

```json
{
  "success": true,
  "message": "Customer signup successful",
  "data": {
    "loginId": 125,
    "personId": 210,
    "customerProfileId": 78,
    "childRoleId": 8,
    "username": "ratan@example.com",
    "name": "Ratan Sharma",
    "email": "ratan@example.com",
    "mobile": "9876543210"
  }
}
```

`SignupResponse` data fields:
- `loginId` (number) - Login record ID
- `personId` (number) - Person record ID  
- `customerProfileId` (number) - Customer profile ID
- `childRoleId` (number) - Role ID
- `username` (string) - Username (typically email)
- `name` (string) - Customer name
- `email` (string) - Email address
- `mobile` (string) - Mobile number

Common error cases:
- `400` validation failed (missing/invalid fields)
- `409` email already exists
- `500` server error

Frontend usage:
- Call signup with name, email, mobile, password
- After successful signup, store customer info (optional auto-login may follow)
- Optionally redirect to login page to authenticate

---

## 5. Public catalog APIs (Customer storefront)

## 5.1 Products (`/api/customer/products`)

### 5.1.1 Search/list products

- Method: `GET`
- Endpoint: `/api/customer/products`
- Auth required: No
- Purpose: Product listing page with search/filter/sort.

Query params:

| Param | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `page` | number | No | `0` | 0-based page |
| `size` | number | No | `12` | page size |
| `search` | string | No | - | name/description/tags search |
| `categoryIds` | number[] | No | - | multi-category filter |
| `brandIds` | number[] | No | - | multi-brand filter |
| `sortBy` | string | No | `crtDt` | e.g. `id`, `name`, `basePrice`, `crtDt` |
| `direction` | string | No | `DESC` | `ASC` or `DESC` |

Response `data`: `PageResponse<CustomerProductCatalogDto>`

`CustomerProductCatalogDto` fields:
- `id` (number)
- `name` (string)
- `categoryId` (number)
- `categoryName` (string)
- `brandId` (number)
- `brandName` (string)
- `basePrice` (number)
- `variantMinPrice` (number)
- `variantMaxPrice` (number)
- `priceDisplay` (string)
- `emoji` (string)
- `imagePath` (ImageMetadata object)
- `tags` (string[])
- `variantCount` (number)
- `inStock` (boolean)
- `createdDate` (string)
- `urlHandle` (string)
- `slug` (string)

`ImageMetadata` fields:
- `path` (string)
- `originalName` (string)

### 5.1.2 Product detail by ID

- Method: `GET`
- Endpoint: `/api/customer/products/{id}`
- Auth required: No
- Purpose: Product detail page.

Path params:
- `id` product ID

Response `data`: `CustomerProductDetailDto`

Main fields:
- `id`, `name`, `description`
- `categoryId`, `categoryName`
- `brandId`, `brandName`
- `basePrice`, `emoji`, `imagePath`, `tags`
- `seoTitle`, `seoDescription`, `urlHandle`
- `attrs` (array)
- `variants` (array)
- `createdDate`, `updatedDate`
- `inStock`, `variantCount`

`attrs[]` item:
- `attributeName` (string)
- `values` (string[])
- `displayOrder` (number)

`variants[]` item (`VariantWithInventoryDto`):
- `id` (number)
- `attrsCombo` (string)
- `sku` (string)
- `price` (number)
- `images` (ImageMetadata[])
- `inventory` object:
  - `available` (boolean)
  - `stockLabel` (string)
  - `lowStockRemaining` (number)
  - `maxCartQuantity` (number)

### 5.1.3 Product detail by slug

- Method: `GET`
- Endpoint: `/api/customer/products/slug/{urlHandle}`
- Auth required: No
- Purpose: SEO-friendly product page URL support.

### 5.1.4 Products by category

- Method: `GET`
- Endpoint: `/api/customer/products/category/{categoryId}`
- Auth required: No
- Purpose: Category listing page.

Query params:
- `page`, `size`, `search`, `sortBy`, `direction`

### 5.1.5 Products by brand

- Method: `GET`
- Endpoint: `/api/customer/products/brand/{brandId}`
- Auth required: No
- Purpose: Brand listing page.

Query params:
- `page`, `size`, `search`, `sortBy`, `direction`

### 5.1.6 Related products

- Method: `GET`
- Endpoint: `/api/customer/products/{id}/related`
- Auth required: No
- Purpose: Show related products on PDP.

Query params:
- `page` (default `0`)
- `size` (default `6`)

---

## 5.2 Categories (`/api/customer/categories`)

### 5.2.1 Get all categories (flat)
- Method: `GET`
- Endpoint: `/api/customer/categories`
- Purpose: Filter sidebar/category chips.
- Response `data`: `CustomerCategoryDto[]`

### 5.2.2 Get category tree
- Method: `GET`
- Endpoint: `/api/customer/categories/tree`
- Purpose: Nested menu/navigation tree.
- Response `data`: `CustomerCategoryDto[]` (top-level with recursive `children`)

### 5.2.3 Get category by ID
- Method: `GET`
- Endpoint: `/api/customer/categories/{id}`
- Purpose: Single category detail.
- Response `data`: `CustomerCategoryDto`

`CustomerCategoryDto` fields:
- `id` (number)
- `name` (string)
- `description` (string)
- `productCount` (number)
- `parentId` (number | null)
- `image` (string)
- `children` (CustomerCategoryDto[])

---

## 5.3 Brands (`/api/customer/brands`)

### 5.3.1 Get all brands
- Method: `GET`
- Endpoint: `/api/customer/brands`
- Purpose: Brand filter and listing.

### 5.3.2 Get featured brands
- Method: `GET`
- Endpoint: `/api/customer/brands/featured`
- Purpose: Homepage highlighted brands.

### 5.3.3 Get verified brands
- Method: `GET`
- Endpoint: `/api/customer/brands/verified`
- Purpose: Partner/verified badge section.

### 5.3.4 Get brand by ID
- Method: `GET`
- Endpoint: `/api/customer/brands/{id}`
- Purpose: Brand detail or brand landing data.

`CustomerBrandDto` fields:
- `id` (number)
- `name` (string)
- `productCount` (number)
- `logoPath` (string)

---

## 5.4 Blogs (`/api/customer/blogs`)

### 5.4.1 Search/list blogs

- Method: `GET`
- Endpoint: `/api/customer/blogs`
- Purpose: Blog listing page with filter/search.

Query params:

| Param | Type | Required | Default |
| --- | --- | --- | --- |
| `page` | number | No | `0` |
| `size` | number | No | `20` |
| `search` | string | No | - |
| `categoryId` | number | No | - |
| `sortBy` | string | No | `id` |
| `direction` | string | No | `DESC` |

Response `data`: `PageResponse<CustomerBlogCatalogDto>`

### 5.4.2 Blog detail by slug

- Method: `GET`
- Endpoint: `/api/customer/blogs/{slug}`
- Purpose: Blog detail page.
- Response `data`: `CustomerBlogDetailDto`

### 5.4.3 Blog categories

- Method: `GET`
- Endpoint: `/api/customer/blogs/categories`
- Purpose: Blog category filter list.
- Response `data`: `CustomerBlogCategoryDto[]`

### 5.4.4 Blogs by category

- Method: `GET`
- Endpoint: `/api/customer/blogs/category/{categoryId}`
- Purpose: Category-specific blog listing.
- Query params: `page`, `size`
- Response `data`: `PageResponse<CustomerBlogCatalogDto>`

### 5.4.5 Related blogs

- Method: `GET`
- Endpoint: `/api/customer/blogs/{slug}/related`
- Purpose: Related blogs section on detail page.
- Query params: `page` (default `0`), `size` (default `5`)
- Response `data`: `PageResponse<CustomerBlogCatalogDto>`

### 5.4.6 Search suggestions

- Method: `GET`
- Endpoint: `/api/customer/blogs/search-suggestions`
- Purpose: Search autocomplete.

Query params:
- `q` (required)
- `limit` (optional, default `10`)

Response `data`: `string[]`

`CustomerBlogCatalogDto` fields:
- `id` (number)
- `title` (string)
- `slug` (string)
- `shortDescription` (string)
- `banner` (string)
- `categoryId` (number)
- `categoryName` (string)
- `createdDate` (string)
- `readingTime` (number)

`CustomerBlogDetailDto` fields:
- `id`, `title`, `slug`
- `shortDescription`, `description`
- `banner`
- `categoryId`, `categoryName`
- `metaTitle`, `metaDescription`, `metaImg`, `metaKeywords`
- `createdDate`, `updatedDate`
- `readingTime`
- `author`

`CustomerBlogCategoryDto` fields:
- `id` (number)
- `name` (string)
- `blogCount` (number)

---

## 6. Protected customer account APIs (`/api/customer-account`)

These APIs are for logged-in customer profile, address book, cart, orders, and checkout.

## 6.1 Profile

### 6.1.1 Get own profile
- Method: `GET`
- Endpoint: `/api/customer-account/profile`
- Auth: Customer JWT required
- Purpose: Account page initial data.
- Response `data`: `CustomerProfileResponse`

### 6.1.2 Update own profile
- Method: `PUT`
- Endpoint: `/api/customer-account/profile`
- Auth: Customer JWT required
- Purpose: Account profile edit form submit.

Request body (`UpsertCustomerProfileRequest`):
- `displayName` (string)
- `email` (string)
- `mobile` (string)
- `gstin` (string)
- `pan` (string)
- `creditLimit` (number)
- `paymentTermsDays` (number)
- `notes` (string)

Response `data`: `CustomerProfileResponse`

`CustomerProfileResponse` fields:
- `id` (number)
- `personId` (number)
- `customerCode` (string)
- `displayName` (string)
- `email` (string)
- `mobile` (string)
- `gstin` (string)
- `pan` (string)
- `creditLimit` (number)
- `paymentTermsDays` (number)
- `notes` (string)

---

## 6.2 Address book

### 6.2.1 Get own addresses
- Method: `GET`
- Endpoint: `/api/customer-account/addresses`
- Auth: Customer JWT required
- Purpose: Show saved shipping/billing addresses.
- Response `data`: `CustomerAddressResponse[]`

### 6.2.2 Create address
- Method: `POST`
- Endpoint: `/api/customer-account/addresses`
- Auth: Customer JWT required
- Purpose: Add new address during account/checkout flow.

Request body (`CreateCustomerAddressRequest`):

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `addressType` | string | Yes | Not blank |
| `contactName` | string | No | - |
| `mobile` | string | No | - |
| `line1` | string | Yes | Not blank |
| `line2` | string | No | - |
| `city` | string | No | - |
| `state` | string | No | - |
| `postalCode` | string | No | - |
| `countryId` | number | No | - |
| `isDefault` | boolean | No | - |

Response `data`: `CustomerAddressResponse`

`CustomerAddressResponse` fields:
- `id` (number)
- `customerProfileId` (number)
- `addressType` (string)
- `contactName` (string)
- `mobile` (string)
- `line1` (string)
- `line2` (string)
- `city` (string)
- `state` (string)
- `postalCode` (string)
- `countryId` (number)
- `isDefault` (boolean)

### 6.2.3 Update address
- Method: `PUT`
- Endpoint: `/api/customer-account/addresses/{addressId}`
- Auth: Customer JWT required
- Purpose: Update an existing address.
- Request body: Same as Create Address (all fields updateable)
- Success response (`200`): `ApiResponse<CustomerAddressResponse>`

### 6.2.4 Delete address
- Method: `DELETE`
- Endpoint: `/api/customer-account/addresses/{addressId}`
- Auth: Customer JWT required
- Purpose: Delete a saved address.
- Request body: None
- Success response (`200`): `{ "success": true, "message": "...", "data": null }`

---

## 6.3 Cart (`/api/customer-account/cart`)

### 6.3.1 Get current cart
- Method: `GET`
- Endpoint: `/api/customer-account/cart`
- Purpose: Load cart page / mini cart.
- Response `data`: `CartResponse`

### 6.3.2 Add item to cart
- Method: `POST`
- Endpoint: `/api/customer-account/cart/items`

Request body (`AddToCartRequest`):

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `variantId` | number | Yes | `@NotNull`, `@Positive` |
| `quantity` | number | Yes | `@NotNull`, `@Positive` |

Response `data`: `CartItemResponse`

### 6.3.3 Update cart item
- Method: `PUT`
- Endpoint: `/api/customer-account/cart/items/{itemId}`

Request body (`UpdateCartItemRequest`):

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `quantity` | number | No | If present, must be positive |
| `warehouseId` | number | No | - |

Response `data`: `CartItemResponse`

### 6.3.4 Remove item from cart
- Method: `DELETE`
- Endpoint: `/api/customer-account/cart/items/{itemId}`
- Response: `ApiResponse<Void>` (`data` usually null)

### 6.3.5 Clear cart
- Method: `DELETE`
- Endpoint: `/api/customer-account/cart`
- Response: `ApiResponse<Void>` (`data` usually null)

`CartResponse` fields:
- `id` (number)
- `customerProfileId` (number)
- `itemCount` (number)

---

## 7. Contact Form API

### 7.1 Submit contact message

- Method: `POST`
- Endpoint: `/api/contact`
- Auth required: No
- Purpose: Submit contact/inquiry form from B2B Orders page or Contact Us page.

Request body:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | Yes | Name of the person submitting (min 2 chars, max 100) |
| `email` | string | Yes | Email address |
| `message` | string | Yes | Message content (min 10 chars, max 2000) |

Example request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I would like to inquire about B2B orders and bulk pricing for our retail store."
}
```

Success response (`201`):

```json
{
  "success": true,
  "message": "Your message has been sent successfully!",
  "data": {
    "id": 15,
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I would like to inquire about...",
    "createdDate": "2026-04-15T10:30:00Z",
    "isRead": false
  }
}
```

`ContactMessageResponse` data fields:
- `id` (number) - Message ID
- `name` (string) - Sender name
- `email` (string) - Sender email
- `message` (string) - Message content
- `createdDate` (string) - Timestamp when message was received
- `isRead` (boolean) - Whether admin has read the message

Common error cases:
- `400` validation failed (empty/invalid fields, message too short)
- `422` unprocessable entity (field validation errors)
- `500` server error

Frontend usage:
- Call on B2B Orders (Contact Us) form submission
- Validate locally: name (2-100 chars), email (valid format), message (10-2000 chars)
- Show success toast: "Message Sent! We'll get back to you soon."
- Clear form after successful submission
- Show error toast on failure with error message
- `items` (CartItemResponse[])

`CartItemResponse` fields:
- `id` (number)
- `cartId` (number)
- `productId` (number)
- `variantId` (number)
- `batchId` (number)
- `warehouseId` (number)
- `sku` (string)
- `productName` (string)
- `brandName` (string)
- `variantLabel` (string)
- `imagePath` (string)
- `slug` (string)
- `unitPrice` (number)
- `quantity` (number)
- `maxQuantity` (number)
- `stockLabel` (string)

---

## 6.4 Orders and checkout (`/api/customer-account/orders`)

### 6.4.1 Get own orders (paginated)

- Method: `GET`
- Endpoint: `/api/customer-account/orders`
- Purpose: Order history page.

Query params:

| Param | Type | Required | Default |
| --- | --- | --- | --- |
| `page` | number | No | `0` |
| `size` | number | No | `10` |
| `sortBy` | string | No | `orderDate` |
| `direction` | string | No | `DESC` |
| `status` | string | No | - |

Supported `status` values:
- `PENDING_PAYMENT`
- `DRAFT`
- `CONFIRMED`
- `PACKED`
- `SHIPPED`
- `DELIVERED`
- `EXPIRED`
- `CANCELLED`

Response `data`: `PageResponse<SalesOrderResponse>`

### 6.4.2 Get order by ID
- Method: `GET`
- Endpoint: `/api/customer-account/orders/{orderId}`
- Purpose: Order detail page.
- Response `data`: `SalesOrderResponse`

### 6.4.3 Create draft order
- Method: `POST`
- Endpoint: `/api/customer-account/orders`
- Purpose: Create draft order directly (legacy/manual order submit flow).

Request body (`CreateSalesOrderRequest`):

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `customerProfileId` | number | No | Ignored for customer-auth flow |
| `customerPersonId` | number | No | Ignored for customer-auth flow |
| `deliveryAddressId` | number | No | Optional |
| `billingAddressId` | number | No | Optional |
| `shippingAddressId` | number | No | Optional |
| `warehouseId` | number | Yes | Required |
| `discountAmount` | number | No | Optional |
| `taxAmount` | number | No | Optional |
| `shippingAmount` | number | No | Optional |
| `remarks` | string | No | Optional |
| `items` | array | Yes | At least one item |

`items[]`:

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `productId` | number | No | Optional |
| `variantId` | number | Yes | Required |
| `batchId` | number | No | Optional |
| `quantity` | number | Yes | Min 1 |
| `unitPrice` | number | No | Optional |
| `discountAmount` | number | No | Optional |
| `taxAmount` | number | No | Optional |

Response `data`: `SalesOrderResponse`

### 6.4.4 Checkout preview (recommended before start session)
- Method: `POST`
- Endpoint: `/api/customer-account/orders/payment-session/preview`
- Purpose: Validate address serviceability and preview totals before creating payment session.

Request body (`CustomerCheckoutSessionRequest`):

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `deliveryAddressId` | number | Yes | Required |
| `remarks` | string | No | Optional |
| `items` | array | Yes | At least one item |

`items[]` follows `CreateSalesOrderRequest.Item` schema.

Response `data`: `CustomerCheckoutPreviewResponse`

Fields:
- `deliveryAddressId` (number)
- `postalCode` (string)
- `serviceable` (boolean)
- `message` (string)
- `orderCount` (number)
- `paymentMethod` (string)
- `subtotal` (number)
- `grandTotal` (number)
- `items` (CustomerCheckoutPreviewLineResponse[])

`CustomerCheckoutPreviewLineResponse`:
- `productId`, `variantId`
- `sku`, `productName`, `variantLabel`
- `quantity`, `unitPrice`, `lineTotal`
- `serviceable` (boolean)
- `stockLabel` (string)
- `message` (string)

### 6.4.5 Start payment session
- Method: `POST`
- Endpoint: `/api/customer-account/orders/payment-session`
- Purpose: Create checkout session and pending-payment orders.

Request body: same as preview API.

Response `data`: `CustomerCheckoutSessionResponse`

Fields:
- `expiresAt` (datetime)
- `paymentMethod` (string)
- `totalAmount` (number)
- `orders` (`SalesOrderResponse[]`)

### 6.4.6 Confirm payment session
- Method: `POST`
- Endpoint: `/api/customer-account/orders/payment-session/confirm`
- Purpose: Confirm payment and update order state.

Request body (`ConfirmCustomerCheckoutRequest`):

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `orderIds` | number[] | Yes | At least one order ID |
| `paymentMethod` | string | Yes | Not blank |

Response `data`: `CustomerCheckoutSessionResponse`

`SalesOrderResponse` fields:
- `id` (number)
- `orderNumber` (string)
- `customerProfileId` (number)
- `customerName` (string)
- `deliveryAddressId` (number)
- `billingAddressId` (number)
- `shippingAddressId` (number)
- `warehouseId` (number)
- `warehouseName` (string)
- `status` (SalesOrderStatus)
- `orderDate` (datetime)
- `confirmedAt` (datetime)
- `paymentMethod` (string)
- `paymentWindowExpiresAt` (datetime)
- `paymentConfirmedAt` (datetime)
- `expiredAt` (datetime)
- `shippedAt` (datetime)
- `cancelledAt` (datetime)
- `subtotal` (number)
- `discountAmount` (number)
- `taxAmount` (number)
- `shippingAmount` (number)
- `grandTotal` (number)
- `remarks` (string)
- `items` (`SalesOrderLineResponse[]`)

`SalesOrderLineResponse` fields:
- `id` (number)
- `productId` (number)
- `variantId` (number)
- `batchId` (number)
- `sku` (string)
- `productName` (string)
- `variantLabel` (string)
- `orderedQty` (number)
- `reservedQty` (number)
- `shippedQty` (number)
- `unitPrice` (number)
- `discountAmount` (number)
- `taxAmount` (number)
- `lineTotal` (number)

---

## 7. Recommended frontend integration flow

1. Public storefront load:
- Load categories, brands, products, blogs without login.

2. Login flow:
- Call `POST /api/auth/login`
- Store `token`, `role`, `personId`, `tenantId`
- Add `Authorization` header for protected APIs.

3. Account and address setup:
- Call profile API
- Create/select delivery address.

4. Cart flow:
- Add/update/remove items via cart APIs
- Keep UI quantity capped by `maxQuantity` and show `stockLabel`.

5. Checkout flow (best practice):
- Call preview endpoint first
- If `serviceable=true`, call payment-session start
- Submit payment method and order IDs to confirm endpoint
- Refresh order list/detail.

---

## 8. Notes for frontend developers

- For most APIs, use `response.data.data` as actual payload (because of `ApiResponse` wrapper).
- Login is different: use `response.data` directly.
- All paging is 0-based (`page=0` is first page).
- Always handle `success=false` responses (some not-found cases return 200 with `success=false`).
- Parse date-time fields as UTC/local according to frontend display rules.
- Keep enum mapping for order statuses in UI:
  - `PENDING_PAYMENT`, `DRAFT`, `CONFIRMED`, `PACKED`, `SHIPPED`, `DELIVERED`, `EXPIRED`, `CANCELLED`
