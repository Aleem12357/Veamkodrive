import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://veamko-drive-hub.lovable.app";
const SITE_NAME = "Veamkodrive";

interface SEOProps {
  title: string;
  description: string;
  /** Optional canonical path override (defaults to current route). */
  path?: string;
  image?: string;
  /** Optional JSON-LD object (or array). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Hide from search engines (e.g. cart, profile). */
  noindex?: boolean;
}

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
};

const upsertLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

export const SEO = ({ title, description, path, image, jsonLd, noindex }: SEOProps) => {
  const location = useLocation();
  const url = SITE_URL + (path ?? location.pathname);
  const img = image ? (image.startsWith("http") ? image : SITE_URL + image) : `${SITE_URL}/placeholder.svg`;
  const fullTitle = title.length > 60 ? title.slice(0, 57) + "…" : title;
  const desc = description.length > 160 ? description.slice(0, 157) + "…" : description;

  useEffect(() => {
    document.title = fullTitle;

    upsertMeta('meta[name="description"]', { name: "description", content: desc });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noindex ? "noindex, nofollow" : "index, follow",
    });

    upsertMeta('meta[property="og:title"]', { property: "og:title", content: fullTitle });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: desc });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: img });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });

    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: fullTitle });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: desc });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: img });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });

    upsertLink("canonical", url);

    // JSON-LD
    const id = "seo-jsonld";
    document.getElementById(id)?.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = id;
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [fullTitle, desc, url, img, noindex, jsonLd]);

  return null;
};

export default SEO;
