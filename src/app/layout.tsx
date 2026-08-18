import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartProvider from "@/context/CartContext";
import WishlistProvider from "@/context/WishlistContext";

export const metadata: Metadata = {
  title: "Destination Wholesale | UK B2B Aesthetics & Beauty Supplier",
  description:
    "Destination Wholesale is a UK-based B2B supplier of professional aesthetics, beauty, skin and SPMU products. Genuine products. Fast delivery. For professionals only.",
  keywords:
    "aesthetics supplier UK, dermal fillers wholesale, SPMU supplies, skin needling products, B2B beauty wholesale",
  openGraph: {
    title: "Destination Wholesale | UK Aesthetics & Beauty Supplier",
    description:
      "Professional aesthetics and beauty supplies for medics, beauty therapists and SPMU specialists.",
    url: "https://destinationwholesale.co.uk",
    siteName: "Destination Wholesale",
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <WishlistProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
