const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const wordpressUrl = trimTrailingSlash(
  process.env.WORDPRESS_URL || "https://destinationwholesale.co.uk",
);

export const env = {
  siteUrl: trimTrailingSlash(
    process.env.NEXT_PUBLIC_SITE_URL || "https://destinationwholesale.co.uk",
  ),
  wordpressUrl,
  wordpressApiUrl: trimTrailingSlash(
    process.env.WORDPRESS_API_URL || `${wordpressUrl}/wp-json`,
  ),
  wooStoreApiUrl: trimTrailingSlash(
    process.env.WOOCOMMERCE_STORE_API_URL || `${wordpressUrl}/wp-json/wc/store/v1`,
  ),
  wooRestApiUrl: trimTrailingSlash(
    process.env.WOOCOMMERCE_REST_API_URL || `${wordpressUrl}/wp-json/wc/v3`,
  ),
  wcConsumerKey: process.env.WC_CONSUMER_KEY || "",
  wcConsumerSecret: process.env.WC_CONSUMER_SECRET || "",
  wordpressUsername: process.env.WORDPRESS_USERNAME || "",
  wordpressAppPassword: process.env.WORDPRESS_APP_PASSWORD || "",
  revalidationSecret: process.env.REVALIDATION_SECRET || "",
  currency: process.env.NEXT_PUBLIC_CURRENCY || "GBP",
  locale: process.env.NEXT_PUBLIC_LOCALE || "en-GB",
} as const;

export const privateEnvStatus = () => ({
  WC_CONSUMER_KEY: Boolean(env.wcConsumerKey),
  WC_CONSUMER_SECRET: Boolean(env.wcConsumerSecret),
  WORDPRESS_USERNAME: Boolean(env.wordpressUsername),
  WORDPRESS_APP_PASSWORD: Boolean(env.wordpressAppPassword),
  REVALIDATION_SECRET: Boolean(env.revalidationSecret),
});
