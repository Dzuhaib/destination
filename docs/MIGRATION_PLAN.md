# Migration Plan

1. Clone production WordPress/WooCommerce to a protected staging environment.
2. Complete the authenticated audit in `INTEGRATION_AUDIT.md`.
3. Connect preview deployments to WordPress staging.
4. Validate catalogue, search, variations, stock, categories, blog, and SEO URLs.
5. Validate cart sessions, coupons, shipping packages/rates, taxes, and guest/customer checkout.
6. Integrate and test every enabled payment gateway using its sandbox mode.
7. Confirm orders, emails, stock reduction, refunds, tracking, analytics, and professional verification.
8. Test customer registration, login, password reset, addresses, order authorization, and document handling.
9. Crawl old and new sites, create explicit redirects, validate canonical URLs, sitemap, and robots rules.
10. Run accessibility, performance, security, mobile, and end-to-end QA.
11. Freeze content briefly, take backups, configure production environment variables, then switch frontend routing.
12. Keep `/wp-admin` and the backend origin available to authorized staff and monitor checkout/order health after launch.

Never point unverified preview checkout at production payment gateways or mutate production orders/customers during QA.
