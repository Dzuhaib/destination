# API Architecture

The browser talks only to Next.js for sensitive or session-bearing operations. Next.js talks to WordPress and WooCommerce.

```text
Browser → Next.js Server Components / Route Handlers → WordPress REST / WooCommerce APIs
```

Public catalogue and blog reads are performed in Server Components and normalized in `src/lib`. WooCommerce Store API cart requests pass through `/api/cart`; the WooCommerce Cart-Token is stored in an HTTP-only cookie and never persisted in a local product database.

Private WooCommerce REST credentials are used only by server modules. Cart, checkout, account, inventory, order, and customer data must use `no-store`. Catalogue and WordPress content use tagged revalidation.

The UI consumes normalized `Product`, `ProductCategory`, and `WordPressPost` types rather than raw upstream payloads.

Checkout must remain WooCommerce-authoritative. A payment adapter, if required, belongs in the `destination-headless-api` WordPress plugin rather than in client-side React code.
