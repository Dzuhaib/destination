# WordPress Setup

## URLs

Set `WORDPRESS_URL` to the WordPress origin, without a trailing slash. Set `WORDPRESS_API_URL` to its `/wp-json` URL.

Test these URLs in a browser or with an HTTP client:

```text
https://your-wordpress-host.example/wp-json/
https://your-wordpress-host.example/wp-json/wp/v2/posts
https://your-wordpress-host.example/wp-json/wc/store/v1/products
```

The first response should list `wp/v2`, `wc/store`, and `wc/store/v1` namespaces.

## WooCommerce REST API

In WordPress go to:

```text
WooCommerce → Settings → Advanced → REST API → Add key
```

Create the key for a dedicated integration user. Use **Read** permission for audits and server-side catalogue/order reads. Change to **Read/Write** only when a verified operation requires writes. Put the generated values in `WC_CONSUMER_KEY` and `WC_CONSUMER_SECRET` in `.env.local` or the deployment secret store. Never use `NEXT_PUBLIC_` for either value.

The public Store API is preferred for products, categories, cart, shipping rates, and checkout where supported. REST credentials remain server-only.

## WordPress Application Password

Create a dedicated least-privilege WordPress integration user. Open that user's profile, locate **Application Passwords**, enter a name such as `Destination Next.js staging`, and generate the password. Set `WORDPRESS_USERNAME` and `WORDPRESS_APP_PASSWORD` in the server environment.

Do not use an administrator's normal password. Revoke the Application Password when it is no longer needed.

## Webhook revalidation

Generate a long random `REVALIDATION_SECRET`. Configure WooCommerce product webhooks and a WordPress post-update hook to POST JSON to:

```text
https://frontend.example/api/revalidate
```

Send the secret in the `x-revalidation-secret` header. Product events may send `{ "resource": "product", "slug": "..." }`; post events may send `{ "resource": "post", "slug": "..." }`.

Use a small custom integration plugin for the WordPress post hook or for any payload/header behavior the standard WooCommerce webhook UI cannot supply.
