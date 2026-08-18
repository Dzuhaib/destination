# Build Destination Wholesale as a Headless WooCommerce + Next.js Ecommerce Platform

## Project Overview

I need to rebuild the frontend of the existing ecommerce website:

https://destinationwholesale.co.uk/

The existing website is a WordPress + WooCommerce ecommerce store.

The goal is NOT to migrate or recreate the existing WordPress database.

The goal is to keep the existing WordPress + WooCommerce installation as the backend/CMS/commerce engine while completely replacing the customer-facing frontend with a modern Next.js application.

This must be implemented as a production-ready headless WooCommerce architecture.

---

# 1. Core Architecture

Use this architecture:

```text
Customer
   ↓
Next.js Frontend
   ↓
Next.js Server / Route Handlers
   ↓
WordPress REST API / WooCommerce Store API / WooCommerce REST API
   ↓
WordPress + WooCommerce
   ↓
Existing MySQL Database
```

IMPORTANT:

* Do NOT connect Next.js directly to MySQL.
* Do NOT recreate WooCommerce's database structure.
* Do NOT migrate products manually into a new database.
* Do NOT duplicate the WooCommerce product database.
* Do NOT expose WooCommerce API secrets to the browser.
* WordPress/WooCommerce remains the source of truth.
* Next.js is only the customer-facing application and frontend.
* All products, orders, customers, inventory, categories, coupons and content must remain managed by WordPress/WooCommerce.

---

# 2. Existing WordPress Responsibilities

WordPress/WooCommerce must continue handling:

* Products
* Product categories
* Product tags
* Product variations
* Product images
* Product descriptions
* Product pricing
* Sale pricing
* Stock
* SKU
* Product visibility
* Featured products
* Product attributes
* Orders
* Order statuses
* Customers
* Customer accounts
* Coupons
* Taxes
* Shipping
* Payment gateway integration
* WooCommerce settings
* Blog posts
* Blog categories
* Blog media
* WordPress users
* Site content
* Professional verification workflow
* Existing WooCommerce plugins/integrations where compatible

The WordPress admin should remain available at:

```text
https://destinationwholesale.co.uk/wp-admin
```

or the existing WordPress admin URL.

The frontend should eventually be served by Next.js.

---

# 3. Next.js Responsibilities

Next.js should handle:

* Homepage
* Header
* Navigation
* Mega menu
* Product listing
* Product search
* Product filtering
* Product sorting
* Product detail pages
* Category pages
* Cart
* Checkout UI
* Customer account UI
* Login
* Registration
* Order history
* Wishlist if supported by the existing backend/plugin
* Product comparison if supported
* Blog
* Blog article pages
* Contact page
* About page
* Static pages
* SEO
* Metadata
* Structured data
* Responsive design
* Performance
* Image optimization
* Loading states
* Error states
* Empty states
* Mobile navigation
* Accessibility

---

# 4. IMPORTANT: Existing Data Must Be Preserved

Before implementing anything, assume the existing WooCommerce database contains valuable production data.

Never:

* Delete the database
* Modify the database schema
* Run destructive SQL
* Reset WooCommerce
* Delete products
* Delete orders
* Delete customers
* Delete media
* Delete WordPress content
* Disable production plugins without confirmation

The existing WordPress/WooCommerce installation must remain untouched while the new frontend is developed.

---

# 5. First Task: Audit the Existing WordPress Installation

Before building the UI, create an integration audit.

Determine which of the following are available:

## WordPress

* WordPress REST API
* Posts API
* Pages API
* Media API
* Categories API
* Tags API
* Users/authentication

## WooCommerce

Determine:

* WooCommerce version
* WooCommerce REST API version
* WooCommerce Store API availability
* HPOS enabled/disabled
* Product count
* Category count
* Product variations
* Product attributes
* Customer account configuration
* Guest checkout configuration
* Shipping methods
* Shipping zones
* Tax configuration
* Payment gateways
* Coupons
* Reviews
* Wishlist plugin
* Compare plugin
* Search/filter plugin
* Any custom WooCommerce plugins
* Any custom REST API endpoints

Do NOT assume that every WordPress plugin will work headlessly.

Identify integrations that require special handling.

---

# 6. Required Environment Variables

Create a `.env.example` file containing every environment variable required by the project.

Use placeholders only.

NEVER hardcode credentials.

The project should support variables similar to:

```env
NEXT_PUBLIC_SITE_URL=https://destinationwholesale.co.uk

WORDPRESS_URL=https://destinationwholesale.co.uk
WORDPRESS_API_URL=https://destinationwholesale.co.uk/wp-json

WOOCOMMERCE_STORE_API_URL=https://destinationwholesale.co.uk/wp-json/wc/store/v1

WOOCOMMERCE_REST_API_URL=https://destinationwholesale.co.uk/wp-json/wc/v3

WC_CONSUMER_KEY=
WC_CONSUMER_SECRET=

WORDPRESS_USERNAME=
WORDPRESS_APP_PASSWORD=

NEXT_PUBLIC_WORDPRESS_URL=
NEXT_PUBLIC_SITE_URL=

NEXT_PUBLIC_CURRENCY=GBP
NEXT_PUBLIC_LOCALE=en-GB

NEXT_PUBLIC_WHATSAPP_URL=
NEXT_PUBLIC_INSTAGRAM_URL=

NEXT_PUBLIC_GOOGLE_MAPS_URL=

NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```

Do not assume all variables are needed.

Only include variables that are actually required.

---

# 7. Create a WordPress → .env Setup Guide

Create:

```text
docs/WORDPRESS_SETUP.md
```

This document must explain exactly how to obtain everything required from the existing WordPress/WooCommerce installation.

Include:

## WordPress URL

```text
WORDPRESS_URL
```

## WordPress REST API

Explain how to test:

```text
/wp-json/
```

and:

```text
/wp-json/wp/v2/posts
```

## WooCommerce REST API

Explain how to generate:

* Consumer Key
* Consumer Secret

from:

```text
WooCommerce
→ Settings
→ Advanced
→ REST API
```

The credentials must have the minimum permissions required.

Prefer:

```text
Read/Write
```

only when write access is actually required.

For read-only frontend operations, use the Store API or read-only mechanisms wherever possible.

## WordPress Application Password

If WordPress authentication is needed, explain how to generate a WordPress Application Password for a dedicated integration user.

Do not use the administrator's normal password.

---

# 8. Create an API Health Check

Create:

```text
/app/api/health/route.ts
```

It should verify that the Next.js server can communicate with WordPress/WooCommerce.

Create a development/admin diagnostic page:

```text
/admin/integration-test
```

Show:

* WordPress connection
* WooCommerce connection
* Product API
* Category API
* Blog API
* Product count
* Category count
* Recent orders if authorized
* Authentication status
* Environment variable status

Never expose API secrets.

---

# 9. API Layer

Create a clean server-side API abstraction.

For example:

```text
src/
  lib/
    wordpress/
      client.ts
      posts.ts
      pages.ts
      media.ts

    woocommerce/
      client.ts
      products.ts
      categories.ts
      cart.ts
      checkout.ts
      orders.ts
      customers.ts
      coupons.ts
      shipping.ts
```

Do not put WooCommerce requests directly inside UI components.

Use reusable service functions.

Example conceptual structure:

```ts
getProducts()
getProductBySlug(slug)
getCategories()
getCategoryBySlug(slug)
searchProducts(query)
getCart()
addToCart()
updateCartItem()
removeCartItem()
createCheckout()
getCustomerOrders()
getBlogPosts()
getBlogPostBySlug()
```

---

# 10. Product System

Products must come from WooCommerce.

Do not create duplicate product data.

Support:

* Simple products
* Variable products
* Product variations
* Product attributes
* SKU
* Price
* Sale price
* Stock status
* Stock quantity where available
* Product images
* Gallery
* Categories
* Tags
* Short description
* Full description
* Weight
* Dimensions
* Related products
* Upsells
* Cross-sells
* Featured products

Product pages must use the existing WooCommerce product ID/slug as the source of truth.

---

# 11. Product URLs

Preserve existing URLs wherever possible.

For example:

```text
/product/[slug]
```

should resolve the corresponding WooCommerce product.

Do not unnecessarily change existing URLs.

Build redirect handling for any URL that must change.

Create a reusable redirect strategy so existing Google-indexed URLs are not unnecessarily broken.

---

# 12. Product Listing

Build a high-quality ecommerce product listing.

Support:

* Category filtering
* Search
* Price filtering
* Stock filtering
* Product attributes
* Sorting
* Pagination or infinite loading
* Responsive product grid
* Loading skeletons
* Empty state
* Error state

Product cards should show:

* Product image
* Product title
* Price
* Sale price
* Stock state
* Sale badge
* Featured/hot badge when available
* SKU where appropriate
* Add to cart
* Quick view if implemented
* Wishlist if supported

Do not invent product information.

---

# 13. Product Detail Page

Build a premium ecommerce product page.

Include:

* Breadcrumbs
* Product gallery
* Product title
* SKU
* Price
* Sale price
* Stock status
* Product variations
* Quantity selector
* Add to basket
* Buy now where appropriate
* Product description
* Product information
* Attributes
* Shipping information
* Related products
* Frequently bought together if supported
* Reviews if available
* Professional purchasing notice where applicable

The current website contains professional qualification/insurance requirements for certain medical-device products.

This requirement must remain visible and must not be removed.

---

# 14. Professional Verification

The current website is specifically aimed at professionals in aesthetics, beauty, SPMU and related fields.

Some products require professional qualification/insurance verification.

Implement the frontend so that this workflow is preserved.

Possible states:

```text
Not logged in
↓
Account created
↓
Verification required
↓
Documents submitted
↓
Pending review
↓
Approved
```

Do NOT invent a new verification backend if WordPress already has one.

First determine how the existing WordPress site handles verification.

If an existing plugin/custom system exists, integrate with it.

If it cannot be accessed through an API, create a clean integration boundary and document what WordPress-side endpoint/plugin customization is required.

---

# 15. Cart

Implement a fully functional cart.

Support:

* Add product
* Add variation
* Change quantity
* Remove product
* Cart totals
* Subtotal
* Discounts
* Tax
* Shipping
* Total
* Stock validation
* Empty cart
* Cart persistence

The cart should be compatible with WooCommerce rather than implementing a separate ecommerce cart database.

Use WooCommerce's Store API/cart mechanism where appropriate.

---

# 16. Checkout

Implement checkout using WooCommerce as the commerce engine.

Support:

* Customer details
* Billing address
* Shipping address
* Shipping methods
* Click & Collect
* Delivery options
* Coupon codes
* Order summary
* Tax
* Payment methods
* Order creation
* Payment redirect/confirmation
* Error handling
* Order confirmation

Do NOT implement an independent payment/order system in Next.js.

WooCommerce must remain responsible for order creation and payment processing.

---

# 17. Payment Gateway Audit

Before implementing checkout, identify the exact payment gateways currently installed on WordPress.

For every gateway determine:

* Plugin name
* Gateway type
* API requirements
* Whether it supports WooCommerce Store API/Blocks
* Whether it supports headless checkout
* Whether it requires frontend JavaScript
* Whether it requires redirect-based payment
* Whether custom integration is required

Do not assume payment compatibility.

If the existing payment gateway cannot work with headless checkout directly, document the required WooCommerce-side adapter/custom endpoint before implementing it.

---

# 18. Shipping

Preserve the existing WooCommerce shipping configuration.

Support:

* Shipping zones
* UK delivery
* Click & Collect
* Same-day courier where configured
* Shipping rates
* Free shipping thresholds
* Delivery restrictions

Do not hardcode shipping prices unless they are explicitly confirmed from WooCommerce.

---

# 19. Customer Accounts

Build:

```text
/login
/register
/account
/account/orders
/account/orders/[id]
/account/details
/account/addresses
/account/password
```

Where technically possible, authenticate against WordPress/WooCommerce.

Do not create a completely separate customer database unless absolutely necessary.

WooCommerce remains the source of truth for customers and orders.

---

# 20. Orders

Customers should be able to view:

* Order number
* Date
* Status
* Items
* Quantity
* Prices
* Shipping
* Taxes
* Total
* Billing information
* Shipping information
* Payment status

Orders must continue appearing normally inside:

```text
WordPress
→ WooCommerce
→ Orders
```

---

# 21. Blog

Use WordPress as the CMS.

Build:

```text
/blog
/blog/[slug]
```

WordPress remains responsible for:

* Creating posts
* Editing posts
* Categories
* Tags
* Featured images
* Authors
* Publishing

Next.js renders the content.

Implement:

* SEO metadata
* Open Graph
* Canonical URLs
* Article structured data
* Related articles
* Category pages
* Pagination

---

# 22. Existing Website Content

Use the existing website as the content/data reference.

The current brand is:

Destination Wholesale / Destination Pharma & Wholesale.

The website positions itself as a UK B2B supplier for:

* Aesthetic supplies
* Dermal fillers
* Skin boosters
* SPMU
* SMP
* Fine-line tattoo supplies
* Consumables
* Equipment
* Training materials
* Starter kits

The current site also promotes next-day delivery, click & collect and same-day courier services.

Do not fabricate business claims.

Fetch dynamic content from WordPress wherever possible.

---

# 23. Existing Site Pages

Recreate equivalent frontend routes for existing important pages, including:

```text
/
 /shop
 /product/[slug]
 /product-category/[slug]
 /about
 /help-contact
 /blog
 /blog/[slug]
 /cart
 /checkout
 /account
 /privacy-policy
 /terms-and-conditions
 /cookie-policy
```

Before implementation, crawl/discover the existing WordPress sitemap and important URLs.

Preserve SEO-critical URLs.

---

# 24. Homepage

Create a premium modern ecommerce homepage based on the existing Destination Wholesale brand.

The current website has:

* Hero section
* Category navigation
* Aesthetic category
* Skin category
* SPMU category
* New Starter Kits
* Consumables & Equipment
* Training Materials
* Featured products
* Top sellers
* New products
* Company information
* Testimonials
* Professional verification notice
* Marketplace links
* Newsletter
* Contact information
* Footer policies

Keep the information architecture but significantly improve the UI/UX.

Do not blindly copy the old WordPress theme.

The new frontend should feel like a modern professional B2B ecommerce platform.

---

# 25. Design Direction

Design should be:

* Premium
* Professional
* Clean
* Trustworthy
* Medical/aesthetic industry appropriate
* B2B focused
* Conversion oriented
* Modern
* Minimal but not boring

Avoid:

* Generic SaaS design
* Excessive gradients
* Excessive animations
* Glassmorphism everywhere
* Huge unnecessary whitespace
* Overly playful ecommerce UI

Prioritize:

* Product imagery
* Clear pricing
* Trust
* Product discovery
* Fast navigation
* Strong CTAs
* Mobile usability
* Professional credibility

Use the existing website's branding/logo/assets where available rather than inventing a completely unrelated identity.

---

# 26. Header

Create a sophisticated ecommerce header.

Include:

* Logo
* Search
* Account
* Wishlist if available
* Cart
* Main navigation
* Categories
* Mobile menu
* Professional account CTA where appropriate

Search should be highly usable.

For desktop, consider:

```text
Logo | Categories | Search | Account | Wishlist | Cart
```

For mobile:

```text
Menu | Logo | Search | Cart
```

---

# 27. Search

Implement real WooCommerce product search.

Support:

* Product name
* SKU
* Category
* Relevant searchable attributes where available

Build a fast autocomplete/search suggestion UI.

Do not load the entire product catalog into the browser.

Search should be server-side.

---

# 28. Performance

The frontend must be highly optimized.

Use:

* Next.js App Router
* Server Components where appropriate
* Server-side data fetching
* Static generation/revalidation where appropriate
* Image optimization
* Lazy loading
* Streaming where useful
* Proper caching
* Minimal client-side JavaScript
* Code splitting

Do not make every component a Client Component.

Use Client Components only when interaction requires them.

---

# 29. Caching Strategy

Use appropriate caching for relatively stable data:

* Categories
* Product catalog
* Product details
* Blog posts
* Static pages

Do NOT aggressively cache:

* Cart
* Checkout
* Customer account
* Order information
* Inventory-sensitive operations

Use revalidation/invalidation when WordPress data changes.

---

# 30. Security

Security is critical.

Never expose:

```text
WC_CONSUMER_SECRET
WORDPRESS_APP_PASSWORD
private API credentials
```

to the browser.

Use:

```text
NEXT_PUBLIC_*
```

only for values that are genuinely safe to expose.

Use server-side route handlers/server actions for sensitive operations.

Validate all incoming data.

Do not trust client-side prices, stock values or totals.

WooCommerce remains the authority for final pricing and order validation.

---

# 31. Error Handling

Implement proper error handling for:

* WordPress unavailable
* WooCommerce unavailable
* Product unavailable
* Product out of stock
* API timeout
* Invalid cart
* Checkout failure
* Payment failure
* Authentication failure
* Expired session
* Invalid coupon
* Shipping unavailable

Create user-friendly error messages.

Never display raw API errors or credentials.

---

# 32. SEO

Implement complete technical SEO.

Include:

* Metadata
* Dynamic title
* Description
* Canonical URLs
* Open Graph
* Twitter/X cards
* Product structured data
* Organization structured data
* Breadcrumb structured data
* Article structured data
* Sitemap
* Robots.txt
* Proper heading hierarchy
* Internal linking
* Image alt text
* 404 page
* Redirect handling

Preserve existing indexed URLs whenever possible.

---

# 33. Analytics

Prepare support for:

* Google Analytics 4
* Google Tag Manager
* Meta Pixel

Do not hardcode IDs.

Use environment variables.

Track:

```text
view_item
view_item_list
search
add_to_cart
remove_from_cart
view_cart
begin_checkout
add_payment_info
purchase
```

Only implement events after confirming the correct analytics configuration.

---

# 34. Accessibility

Target WCAG 2.2 AA where practical.

Implement:

* Keyboard navigation
* Focus states
* Semantic HTML
* Proper labels
* Accessible dialogs
* Accessible mobile navigation
* Proper color contrast
* Alt text
* Screen-reader friendly states

---

# 35. Tech Stack

Use:

* Next.js
* TypeScript
* App Router
* Tailwind CSS
* Modern React
* Server Components
* Route Handlers
* Zod for validation where useful

Use a clean component architecture.

Do not introduce unnecessary dependencies.

---

# 36. Project Structure

Use a scalable structure similar to:

```text
src/
  app/
    page.tsx
    shop/
    product/
    category/
    cart/
    checkout/
    account/
    blog/
    api/

  components/
    layout/
    navigation/
    products/
    cart/
    checkout/
    account/
    blog/
    ui/

  lib/
    wordpress/
    woocommerce/
    auth/
    seo/
    utils/

  types/
    wordpress.ts
    woocommerce.ts
    product.ts
    order.ts
    customer.ts

  hooks/
  config/
```

Adapt the structure if a better architecture is appropriate.

---

# 37. Type Safety

Do not use:

```ts
any
```

unless there is a genuinely unavoidable reason.

Create proper TypeScript types for:

* Product
* Variation
* Category
* Cart
* Cart Item
* Customer
* Order
* Order Item
* Blog Post
* WordPress Media
* API responses

Validate external API responses where useful.

---

# 38. API Abstraction

The UI must never depend directly on raw WooCommerce response structures everywhere.

Normalize API data.

For example:

```ts
Product {
  id
  name
  slug
  sku
  price
  regularPrice
  salePrice
  stockStatus
  images
  categories
  variations
}
```

This keeps the frontend maintainable if the backend API changes.

---

# 39. Existing Plugin Compatibility

Create a document:

```text
docs/PLUGIN_COMPATIBILITY.md
```

List every relevant WordPress/WooCommerce plugin and classify it:

```text
Compatible
Needs API integration
Needs custom endpoint
Frontend-only and replaced by Next.js
Not required
Unknown — needs testing
```

Do not remove any plugin until its dependency is understood.

---

# 40. WordPress Custom API Extensions

If the existing WordPress installation lacks an endpoint required by the Next.js frontend, create a small custom WordPress integration plugin rather than modifying the WordPress theme.

Create something conceptually like:

```text
destination-headless-api
```

It should contain only the custom API functionality required by Next.js.

Do not put business logic inside the Next.js application if that logic belongs to WooCommerce.

---

# 41. Important Production Rule

The existing WordPress site is production.

Therefore:

```text
DO NOT:
- Reset WordPress
- Change database schema
- Delete data
- Import fake products
- Modify production orders
- Modify customer records
- Change payment settings
- Change shipping settings
```

without explicit confirmation.

Development must happen against a staging environment whenever possible.

---

# 42. Migration Strategy

Do NOT switch the production domain immediately.

Build:

```text
Next.js
↓
staging frontend
↓
existing WordPress staging/backend
```

Test:

* Products
* Search
* Categories
* Product details
* Cart
* Checkout
* Payments
* Orders
* Customer login
* Customer registration
* Blog
* SEO
* Mobile
* Desktop

Only after everything passes QA should the domain be switched.

---

# 43. Domain Architecture

Preferred final setup:

```text
destinationwholesale.co.uk
        ↓
      Next.js
        ↓
WordPress backend
```

Keep WordPress available on a protected/admin/backend URL or existing hosting endpoint.

The public customer-facing frontend should not rely on WordPress rendering pages.

Do not expose unnecessary WordPress endpoints publicly beyond what is required.

---

# 44. Development Environment

Create:

```text
.env.example
.env.local
README.md
docs/WORDPRESS_SETUP.md
docs/PLUGIN_COMPATIBILITY.md
docs/API_ARCHITECTURE.md
docs/MIGRATION_PLAN.md
```

`.env.local` must never be committed.

Add appropriate `.gitignore` rules.

---

# 45. README

Create a complete README explaining:

1. Project architecture
2. Requirements
3. Installation
4. Environment variables
5. WordPress setup
6. WooCommerce API setup
7. Local development
8. Production deployment
9. API architecture
10. Authentication
11. Cart
12. Checkout
13. Deployment
14. Troubleshooting

---

# 46. Deployment

The application should be deployable to Vercel.

Prepare:

* Production environment variables
* Preview environment
* Build configuration
* Image configuration
* CORS considerations
* WordPress API access
* Webhook/revalidation strategy

Do not assume Vercel configuration is complete until the production build succeeds.

---

# 47. Webhooks / Revalidation

If practical, implement a WordPress/WooCommerce webhook strategy.

When:

* Product updated
* Product created
* Product deleted
* Stock changed
* Blog post updated

the Next.js cache should be revalidated.

Do not rely on extremely short cache times as the primary synchronization strategy.

---

# 48. Testing

Create tests for critical functionality.

At minimum test:

```text
Homepage
Product listing
Product details
Search
Category filtering
Cart
Cart updates
Checkout
Order creation
Customer login
Customer registration
Customer orders
Blog
404
Mobile navigation
API failure
Out-of-stock product
```

Most importantly:

```text
Add product
→ Cart
→ Checkout
→ Payment
→ WooCommerce order
→ Order visible in WordPress
```

This complete flow must work before production launch.

---

# 49. Do Not Fake Backend Functionality

If a backend API is unavailable:

DO NOT create fake/mock production behavior and pretend it is connected.

Instead:

1. Identify the missing API.
2. Explain what is required.
3. Create the appropriate WordPress API extension if necessary.
4. Document the setup.
5. Keep the UI integration clean.

The final application must use real WooCommerce data.

---

# 50. Final Deliverable

The completed project should provide:

```text
Next.js frontend
+
WooCommerce integration
+
WordPress integration
+
Secure environment configuration
+
Product API
+
Category API
+
Cart
+
Checkout
+
Customer accounts
+
Orders
+
Blog
+
Search
+
Filtering
+
SEO
+
Analytics preparation
+
Responsive UI
+
Accessibility
+
Caching
+
Error handling
+
Documentation
```

The WordPress/WooCommerce database remains the single source of truth.

The Next.js application must be treated as a headless frontend, not a replacement for WooCommerce.

---

# 51. Development Order

Do not attempt to build everything at once.

Follow this order:

## Step 1

Audit WordPress/WooCommerce.

## Step 2

Create `.env.example`.

## Step 3

Connect to WordPress.

## Step 4

Connect to WooCommerce.

## Step 5

Create API health check.

## Step 6

Fetch real products.

## Step 7

Fetch real categories.

## Step 8

Build homepage.

## Step 9

Build shop/category pages.

## Step 10

Build product pages.

## Step 11

Build cart.

## Step 12

Build authentication/customer accounts.

## Step 13

Build checkout.

## Step 14

Test payment integration.

## Step 15

Test order creation.

## Step 16

Build blog.

## Step 17

Implement SEO.

## Step 18

Implement analytics.

## Step 19

Performance optimization.

## Step 20

Production QA.

## Step 21

Production domain migration.

---

# 52. Critical Principle

At every stage remember:

```text
WORDPRESS + WOOCOMMERCE
=
SOURCE OF TRUTH

NEXT.JS
=
FRONTEND
```

Do not duplicate business-critical ecommerce data.

Do not bypass WooCommerce's order/payment/inventory logic unnecessarily.

Do not directly access the production MySQL database from Next.js.

Build a robust API-driven headless architecture that allows the existing WordPress admin to continue operating normally while completely replacing the broken WordPress frontend.

Start by auditing the existing WordPress/WooCommerce installation and identifying exactly what credentials, APIs, plugins, payment gateways, shipping methods, authentication mechanisms and custom functionality are required before building the UI.
