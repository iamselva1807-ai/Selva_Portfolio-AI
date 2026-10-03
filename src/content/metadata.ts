import type { Metadata } from "next";
import { site } from "./site";
import { pageMeta, seo } from "./seo";

/**
 * Next does not deep-merge `openGraph` / `twitter` from the root layout: a page
 * that omits them inherits the homepage's wholesale, and a page that sets them
 * replaces the parent's entirely — losing the image.
 *
 * Both failure modes were live: six section pages advertised the homepage as
 * their og:url/title/description, and all four case studies shipped with no
 * og:image at all, so sharing one previewed blank.
 *
 * Build page metadata through here so every route carries its own correct
 * Open Graph and Twitter block, image included.
 */
export function buildPageMetadata({
  route,
  title,
  description,
  type = "website",
}: {
  route: string;
  title?: string;
  description?: string;
  type?: "website" | "article";
}): Metadata {
  const meta = pageMeta(route);
  const resolvedTitle = title ?? meta?.title ?? site.name;
  const resolvedDescription = description ?? meta?.description ?? seo.siteDescription;
  const url = route === "/" ? site.url : `${site.url}${route}`;

  // The root layout's title template appends the site name; Open Graph has no
  // template, so compose the full string here.
  const socialTitle =
    route === "/" ? seo.ogTitle : `${resolvedTitle} — ${site.name}`;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: route },
    openGraph: {
      type,
      locale: "en_US",
      siteName: site.name,
      url,
      title: socialTitle,
      description: resolvedDescription,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${site.name} — ${site.role}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: resolvedDescription,
      images: ["/opengraph-image"],
    },
  };
}
