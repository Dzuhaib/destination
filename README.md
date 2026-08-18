# Destination Wholesale Headless Storefront

Next.js customer frontend for the existing Destination Wholesale WordPress and WooCommerce installation. WordPress/WooCommerce remains the source of truth for products, inventory, customers, orders, payments, shipping, tax, coupons, verification, media, and editorial content.

## Architecture

```text
Customer → Next.js → Next.js server/route handlers → WordPress and WooCommerce APIs
```

Next.js never connects to MySQL. Private credentials are server-only. Public catalogue and blog responses are normalized before reaching UI components. WooCommerce cart sessions use the Store API through a Next.js proxy and an HTTP-only Cart-Token cookie.

## Requirements

- Node.js 20 or newer
- A WordPress installation with WooCommerce and REST APIs enabled
- A staging WordPress/WooCommerce environment for checkout and account development
- WooCommerce REST credentials for authenticated audit/order operations

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

On Windows PowerShell, create `.env.local` from `.env.example` using your preferred editor or file copy command. Fill only the values required for the feature being tested. `.env.local` is ignored by Git.

Open `http://localhost:3000`. The diagnostic page is at `http://localhost:3000/admin/integration-test`; machine-readable health is at `/api/health`.

## Environment variables

See `.env.example` and [WordPress setup](docs/WORDPRESS_SETUP.md). `WC_CONSUMER_SECRET`, `WORDPRESS_APP_PASSWORD`, and `REVALIDATION_SECRET` must never use a `NEXT_PUBLIC_` prefix.

The application defaults public read URLs to `https://destinationwholesale.co.uk`, but deployment environments should set them explicitly.

## Implemented integration

- WooCommerce Store API product catalogue, categories, search, sorting, pagination, stock, prices, and product pages
- WooCommerce Store API cart proxy and persistent Cart-Token session
- WordPress REST API blog and articles
- Product and article metadata/structured data
- Sitemap, robots, canonical routes, legacy policy/contact routes, and 404
- Health diagnostics and authenticated cache revalidation
- Server-side normalized TypeScript API layer

## Authentication, checkout, and orders

These features are deliberately gated until the private staging audit is complete. The application does not create a separate customer/order database and does not fake successful orders. The exact WordPress authentication, professional verification, payment gateway, shipping, and tax contracts must be confirmed first.

Review [the integration audit](docs/INTEGRATION_AUDIT.md), [plugin compatibility](docs/PLUGIN_COMPATIBILITY.md), and [migration plan](docs/MIGRATION_PLAN.md).

## Cart

Browser requests go to `/api/cart`. Next.js forwards them to WooCommerce Store API and stores the returned Cart-Token in an HTTP-only, same-site cookie. Cart data is never cached. WooCommerce validates product IDs, quantities, prices, stock, coupons, shipping, and totals.

## Caching and webhooks

Products/categories and WordPress content use tagged Next.js revalidation. Configure WordPress/WooCommerce to call `/api/revalidate` with `x-revalidation-secret`; details are in `docs/WORDPRESS_SETUP.md`. Cart, checkout, account, and order traffic must use `no-store`.

## Deployment

The app is compatible with Vercel. Configure all environment variables separately for Preview and Production. Preview should target WordPress staging. Confirm WordPress permits outbound access from the deployment, remote product images resolve, and the full production build succeeds:

```bash
npm run build
```

Do not point preview checkout at live payment gateways. Complete sandbox payment/order testing and the migration checklist before switching the public domain.

## Troubleshooting

- `503` from `/api/health`: verify WordPress URLs, firewall/CDN rules, and REST API availability.
- Products missing: test `/wp-json/wc/store/v1/products` directly and verify WooCommerce catalogue visibility.
- Cart update rejected: inspect the sanitized Store API error and confirm product/variation IDs and stock.
- Images rejected by Next.js: add the actual WordPress media hostname to `next.config.ts` remote patterns.
- Orders unavailable: configure server-only WooCommerce REST credentials and implement customer authorization before exposing order data.

No production database, order, customer, plugin, payment, shipping, or WordPress setting is modified by this frontend.
