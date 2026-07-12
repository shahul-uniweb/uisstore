import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

// Fonts are @imported inside styles.css (latin subset) so they land in ONE
// stylesheet — importing them here produced a second render-blocking CSS file.
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { initAnalytics, logVisit } from "../lib/firebase";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "E-Commerce Website Kuwait | Online Store Packages — UiS Store" },
      {
        name: "description",
        content:
          "UiS Store builds bilingual English & Arabic e-commerce websites in Kuwait with KNET payments, GCC delivery, inventory and admin panel. Packages from 450 K.D/year — hosting, domain & SSL included. By Uniweb IT Solutions.",
      },
      {
        name: "keywords",
        content:
          "ecommerce website kuwait, online store kuwait, ecommerce kuwait, KNET payment gateway, arabic online store, e-commerce packages kuwait, uis store, uisstore, uniweb, uniweb it solutions, online shop kuwait, ecommerce website design kuwait, GCC delivery, متجر الكتروني الكويت",
      },
      { name: "author", content: "Uniweb IT Solutions" },
      {
        name: "robots",
        content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      },
      { name: "theme-color", content: "#E61C83" },
      // local SEO — Kuwait
      { name: "geo.region", content: "KW" },
      { name: "geo.placename", content: "Kuwait City" },
      { name: "geo.position", content: "29.3759;47.9774" },
      { name: "ICBM", content: "29.3759, 47.9774" },
      // Open Graph
      { property: "og:site_name", content: "UiS Store" },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "ar_KW" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://uisstore.net/" },
      {
        property: "og:title",
        content: "E-Commerce Website Kuwait | Online Store Packages — UiS Store",
      },
      {
        property: "og:description",
        content:
          "Launch your online store in Kuwait: KNET payments, English & Arabic, GCC delivery, admin panel. Packages from 450 K.D/year with hosting, domain & SSL included.",
      },
      // Social share preview card (1200x630). The width/height/type hints let
      // WhatsApp, Facebook and LinkedIn lay the card out before the image finishes
      // downloading — without them some clients fall back to a tiny thumbnail.
      { property: "og:image", content: "https://uisstore.net/og-image.jpg" },
      { property: "og:image:secure_url", content: "https://uisstore.net/og-image.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content:
          "UiS Store by Uniweb IT Solutions — e-commerce websites in Kuwait from 450 K.D per year",
      },
      // Twitter — must be summary_large_image, or X renders a small square thumbnail.
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@uniweb008" },
      {
        name: "twitter:title",
        content: "E-Commerce Website Kuwait | Online Store Packages — UiS Store",
      },
      {
        name: "twitter:description",
        content:
          "Bilingual e-commerce websites in Kuwait with KNET payments, GCC delivery and admin panel. From 450 K.D/year — by Uniweb IT Solutions.",
      },
      { name: "twitter:image", content: "https://uisstore.net/og-image.jpg" },
      {
        name: "twitter:image:alt",
        content:
          "UiS Store by Uniweb IT Solutions — e-commerce websites in Kuwait from 450 K.D per year",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "canonical", href: "https://uisstore.net/" },
      { rel: "alternate", hrefLang: "en", href: "https://uisstore.net/" },
      { rel: "alternate", hrefLang: "x-default", href: "https://uisstore.net/" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      // Warm up the origins the deferred Firebase / IP-lookup calls will hit.
      { rel: "preconnect", href: "https://firestore.googleapis.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://ipwho.is", crossOrigin: "anonymous" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // Client-only: init Firebase Analytics and log the visitor's IP location once.
  //
  // Deferred until the page has loaded AND the main thread is idle. Firing these
  // on mount pulled in the Firebase SDK + Google Tag Manager (~142 KB) during the
  // critical render, which was a large chunk of the Total Blocking Time. Analytics
  // and visit logging don't need to be immediate — a couple of seconds late is fine.
  useEffect(() => {
    let cancelled = false;

    const run = () => {
      if (cancelled) return;
      const idle = window.requestIdleCallback ?? ((cb: IdleRequestCallback) => setTimeout(cb, 1));
      idle(() => {
        if (cancelled) return;
        void initAnalytics();
        void logVisit();
      });
    };

    if (document.readyState === "complete") run();
    else window.addEventListener("load", run, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", run);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
