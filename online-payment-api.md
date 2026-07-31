# Online Payment API Contract (Customer Side)

This document contains the complete API contract for customer online payment integration using Cashfree.

## 1. Integration overview

- Payment gateway: Cashfree
- API base path: /api
- Auth required for customer payment APIs: Bearer token
- Request content type: application/json
- Customer checkout inventory lock window: 5 minutes

## 2. Standard response formats

### 2.1 Success response wrapper

All customer order/payment APIs return this wrapper:

```json
{
  "success": true,
  "message": "Payment session started successfully",
  "data": {}
}
```

### 2.2 Error response format

Validation/business/system errors return:

```json
{
  "error": "BAD_REQUEST",
  "message": "Readable error message",
  "status": 400,
  "timestamp": "2026-04-26 18:10:12"
}
```

## 3. Enums and important values

### 3.1 Payment method

- CASHFREE
- COD

For online flow, use CASHFREE.

### 3.2 Payment status (online)

- PENDING
- PAID
- FAILED
- USER_DROPPED
- EXPIRED
- CANCELLED
- ERROR

### 3.3 Sales order status

- PENDING_PAYMENT
- DRAFT
- CONFIRMED
- PACKED
- SHIPPED
- DELIVERED
- EXPIRED
- CANCELLED

## 4. Data schemas

### 4.1 CustomerCheckoutSessionRequest (used by preview and start)

```json
{
  "deliveryAddressId": 101,
  "paymentMethod": "CASHFREE",
  "remarks": "Leave at gate",
  "items": [
    {
      "productId": 11,
      "variantId": 201,
      "batchId": 501,
      "quantity": 2,
      "unitPrice": 1499.0,
      "discountAmount": 0,
      "taxAmount": 0
    }
  ]
}
```

Validation:

- deliveryAddressId: required
- items: required, non-empty
- items[].variantId: required
- items[].quantity: required, min 1
- paymentMethod: optional in request, defaults to CASHFREE if omitted

### 4.2 CustomerCheckoutPreviewResponse

```json
{
  "deliveryAddressId": 101,
  "postalCode": "560001",
  "serviceable": true,
  "message": "All items are serviceable",
  "orderCount": 1,
  "paymentMethod": "CASHFREE",
  "subtotal": 2998.0,
  "grandTotal": 2998.0,
  "items": [
    {
      "productId": 11,
      "variantId": 201,
      "sku": "SKU-201",
      "productName": "Sample Product",
      "variantLabel": "500ml",
      "quantity": 2,
      "unitPrice": 1499.0,
      "lineTotal": 2998.0,
      "serviceable": true,
      "stockLabel": "In Stock",
      "message": "Available"
    }
  ]
}
```

### 4.3 CustomerCheckoutSessionResponse

```json
{
  "expiresAt": "2026-04-26T18:15:00",
  "paymentMethod": "CASHFREE",
  "gateway": "CASHFREE",
  "merchantOrderId": "CF_abc123...",
  "paymentSessionId": "session_xxx",
  "cashfreeMode": "sandbox",
  "paymentStatus": "PENDING",
  "totalAmount": 2998.0,
  "orders": []
}
```

Notes:

- gateway, merchantOrderId, paymentSessionId, cashfreeMode are populated for online (CASHFREE).
- paymentStatus for online comes from payment transaction state.

### 4.4 SalesOrderResponse (inside orders array)

```json
{
  "id": 9001,
  "orderNumber": "SO-0001",
  "customerProfileId": 77,
  "customerName": "ABC Traders",
  "deliveryAddressId": 101,
  "billingAddressId": 101,
  "shippingAddressId": 101,
  "warehouseId": 2,
  "warehouseName": "Main WH",
  "status": "PENDING_PAYMENT",
  "orderDate": "2026-04-26T18:10:00",
  "confirmedAt": null,
  "paymentMethod": "CASHFREE",
  "paymentWindowExpiresAt": "2026-04-26T18:15:00",
  "paymentConfirmedAt": null,
  "expiredAt": null,
  "shippedAt": null,
  "cancelledAt": null,
  "subtotal": 2998.0,
  "discountAmount": 0.0,
  "taxAmount": 0.0,
  "shippingAmount": 0.0,
  "grandTotal": 2998.0,
  "remarks": "Leave at gate",
  "items": [
    {
      "id": 1,
      "productId": 11,
      "variantId": 201,
      "batchId": 501,
      "sku": "SKU-201",
      "productName": "Sample Product",
      "variantLabel": "500ml",
      "orderedQty": 2,
      "reservedQty": 2,
      "shippedQty": 0,
      "unitPrice": 1499.0,
      "discountAmount": 0.0,
      "taxAmount": 0.0,
      "lineTotal": 2998.0
    }
  ]
}
```

## 5. API endpoints for online payment flow

## 5.1 Preview checkout

- Method: POST
- URL: /api/customer-account/orders/payment-session/preview
- Auth: Required (Bearer)
- Purpose: Validate delivery serviceability, stock routing, and totals before starting payment.

Request body: CustomerCheckoutSessionRequest

Success response:

```json
{
  "success": true,
  "message": "Checkout preview prepared successfully",
  "data": {
    "deliveryAddressId": 101,
    "postalCode": "560001",
    "serviceable": true,
    "message": "All items are serviceable",
    "orderCount": 1,
    "paymentMethod": "CASHFREE",
    "subtotal": 2998.0,
    "grandTotal": 2998.0,
    "items": []
  }
}
```

Common error cases:

- 400 BAD_REQUEST with message for invalid request or non-serviceable checkout

## 5.2 Start payment session (online)

- Method: POST
- URL: /api/customer-account/orders/payment-session
- Auth: Required (Bearer)
- Purpose: Create pending-payment sales orders, reserve inventory, and create Cashfree payment session.

Request body: CustomerCheckoutSessionRequest

Recommended for online:

```json
{
  "deliveryAddressId": 101,
  "paymentMethod": "CASHFREE",
  "remarks": "Leave at gate",
  "items": [
    {
      "productId": 11,
      "variantId": 201,
      "batchId": 501,
      "quantity": 2,
      "unitPrice": 1499.0
    }
  ]
}
```

Success response:

```json
{
  "success": true,
  "message": "Payment session started successfully",
  "data": {
    "expiresAt": "2026-04-26T18:15:00",
    "paymentMethod": "CASHFREE",
    "gateway": "CASHFREE",
    "merchantOrderId": "CF_abc123...",
    "paymentSessionId": "session_xxx",
    "cashfreeMode": "sandbox",
    "paymentStatus": "PENDING",
    "totalAmount": 2998.0,
    "orders": []
  }
}
```

Common error cases:

- 400 BAD_REQUEST, examples:
  - Cashfree payment amount must be at least INR 1.00
  - A customer mobile number is required for online payment
  - Cashfree return URL is not configured
  - Serviceability or stock related business errors

## 5.3 Verify payment session

- Method: POST
- URL: /api/customer-account/orders/payment-session/{merchantOrderId}/verify
- Auth: Required (Bearer)
- Purpose: Re-check transaction status from Cashfree and return latest payment/order state.

Path example:

- /api/customer-account/orders/payment-session/CF_abc123.../verify

Request body:

- Empty body

Success response (paid example):

```json
{
  "success": true,
  "message": "Payment status verified successfully",
  "data": {
    "expiresAt": "2026-04-26T18:15:00",
    "paymentMethod": "CASHFREE",
    "gateway": "CASHFREE",
    "merchantOrderId": "CF_abc123...",
    "paymentSessionId": "session_xxx",
    "cashfreeMode": "sandbox",
    "paymentStatus": "PAID",
    "totalAmount": 2998.0,
    "orders": [
      {
        "id": 9001,
        "orderNumber": "SO-0001",
        "status": "CONFIRMED",
        "paymentMethod": "CASHFREE",
        "paymentConfirmedAt": "2026-04-26T18:12:30"
      }
    ]
  }
}
```

Common error cases:

- 400 BAD_REQUEST:
  - Payment session not found
  - Payment session does not belong to this customer

## 5.4 Orders list (for post-payment history)

- Method: GET
- URL: /api/customer-account/orders
- Auth: Required (Bearer)
- Query params:
  - page (default 0)
  - size (default 10)
  - sortBy (default orderDate)
  - direction (default DESC)
  - status (optional)

Example:

- /api/customer-account/orders?page=0&size=10&sortBy=orderDate&direction=DESC

## 5.5 Single order detail

- Method: GET
- URL: /api/customer-account/orders/{orderId}
- Auth: Required (Bearer)

## 6. Endpoint not used for online flow

## 6.1 Confirm payment session (COD only)

- Method: POST
- URL: /api/customer-account/orders/payment-session/confirm

Do not call this endpoint for Cashfree online payment. It is COD-only.

## 7. Cashfree webhook endpoint (backend-to-backend)

This is provided for infra/reference only, not for UI calls.

- Method: POST
- URL: /api/payments/cashfree/webhook
- Auth: Public endpoint (no bearer token)
- Headers required from gateway:
  - x-webhook-signature
  - x-webhook-timestamp
- Responses:
  - 200: ok
  - 400: invalid signature

## 8. Recommended UI flow for online payment

1. Call preview API.
2. If serviceable is true, call start payment-session API.
3. Launch Cashfree checkout using paymentSessionId and cashfreeMode.
4. On gateway return and/or polling, call verify API by merchantOrderId until final status.
5. Show final state via orders list/detail endpoints.

## 9. Implementation notes

- Backend wraps successful responses in ApiResponse; actual payload is inside data.
- Keep merchantOrderId from start API; it is required for verify API.
- paymentStatus in verify response is the key state to drive UI messaging.
- If paymentStatus is not PAID, allow retry based on expiresAt and business UX rules.
