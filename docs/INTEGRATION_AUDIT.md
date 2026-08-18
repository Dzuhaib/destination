# WordPress and WooCommerce Integration Audit

Audit date: 15 August 2026

## Confirmed public API surface

The WordPress REST API root at `https://destinationwholesale.co.uk/wp-json/` is available and identifies the site as Destination Wholesale.

Confirmed namespaces include:

- `wp/v2` for WordPress content
- `wc/store/v1` for public products, categories, cart, and checkout capabilities
- `wc/v3`, `wc/v2`, and `wc/v1` for authenticated WooCommerce REST operations
- `paypal/v1` and `wc/v3/wc_paypal`
- `wc-shipment-tracking/v3`
- `acfw/v2` (Advanced Coupons)
- `contact-form-7/v1`
- `mailchimp-for-woocommerce/v1`
- `wc/gla` (Google Listings and Ads)
- `yoast/v1`
- `sot/v1` (custom or plugin-provided; purpose must be confirmed)

The namespace list also indicates Jetpack, Elementor/Elementor Pro, LiteSpeed, Complianz, WP Mail SMTP, Google Site Kit, WooCommerce analytics/admin, Hostinger tools, WPForms, and other administrative plugins.

## Implemented from public APIs

- Product catalogue and product detail reads through WooCommerce Store API
- Categories and category counts
- Live WooCommerce cart sessions through a server proxy and HTTP-only Cart-Token cookie
- WordPress blog listing and article rendering
- Server health checks and an integration diagnostic page
- Tagged caching and authenticated webhook revalidation endpoint
- Normalized TypeScript application models

## Requires authenticated staging audit

The following cannot be determined safely from public endpoints:

- Exact WooCommerce and plugin versions
- HPOS state
- Complete plugin inventory and custom plugin code
- Product variation rules and restricted-product metadata
- Customer/guest checkout configuration
- Shipping zones, rates, click-and-collect, courier rules, and restrictions
- Tax configuration and whether catalogue prices include tax
- Enabled payment gateway IDs, credentials, capture modes, and Store API compatibility
- Coupon configuration
- Customer authentication/session mechanism
- Professional verification state, document storage, user metadata, and approval rules
- Wishlist and comparison data ownership
- Recent orders and customer order authorization
- Webhook inventory
- Purpose and contract of custom `sot/v1` endpoints

Do not enable production checkout, registration, login, order reads, or verification uploads until these items are confirmed on staging.

## Required next audit access

1. A WordPress staging URL cloned from production with customer/order data sanitized where appropriate.
2. A dedicated integration user with a WordPress Application Password.
3. WooCommerce REST API credentials. Start with Read access; grant Read/Write only for the checkout/order operation that is proven to require it.
4. A WordPress admin export or screenshots of WooCommerce payment, shipping, tax, accounts/privacy, and advanced settings.
5. The active plugin list, including versions and any must-use plugins.
6. Documentation or source for the existing professional verification workflow.

No production settings or records were changed during this audit.
