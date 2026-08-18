# Plugin Compatibility

This classification is based on namespaces exposed publicly. Versions and active state require an authenticated staging audit.

| Integration | Classification | Notes |
| --- | --- | --- |
| WooCommerce | Compatible | Store API powers catalogue/cart; checkout needs gateway audit. |
| WordPress core REST API | Compatible | Posts and media are rendered by Next.js. |
| PayPal | Needs API integration | PayPal namespaces are present; exact plugin and Store API/Blocks support must be tested. |
| WooCommerce Shipment Tracking | Needs API integration | Useful for authenticated order detail after customer authorization is designed. |
| Advanced Coupons (`acfw/v2`) | Needs API integration | Standard Store API coupons may work; advanced rules need end-to-end testing. |
| Yoast SEO | Needs API integration | Metadata can be consumed if Yoast REST fields are enabled; frontend rendering is replaced. |
| Contact Form 7 | Needs API integration | Forms rendered by WordPress do not automatically work in Next.js. |
| Mailchimp for WooCommerce | Unknown - needs testing | Server/order synchronization may remain compatible; frontend signup needs an approved endpoint. |
| Google Listings and Ads | Unknown - needs testing | Product feed may remain backend-driven; conversion tracking requires validation. |
| Elementor / Elementor Pro | Frontend-only and replaced by Next.js | Page content may be consumed, but Elementor layouts are not reused. |
| LiteSpeed Cache | Frontend-only and replaced by Next.js | Remains useful for WordPress API/backend caching only if configured correctly. |
| Complianz | Frontend-only and replaced by Next.js | Consent UI/scripts must be implemented for Next.js; legal configuration remains a reference. |
| Jetpack | Unknown - needs testing | Features must be reviewed individually. |
| WP Mail SMTP | Compatible | Backend transactional mail remains in WordPress/WooCommerce. |
| Google Site Kit | Frontend-only and replaced by Next.js | Next.js analytics configuration is separate. |
| Custom `sot/v1` API | Needs custom endpoint audit | Contract and ownership are unknown. Do not depend on it until documented. |
| Wishlist / compare | Unknown - needs testing | No confirmed public contract; do not create a separate production data store. |

No plugin should be disabled or removed based on this table alone.
