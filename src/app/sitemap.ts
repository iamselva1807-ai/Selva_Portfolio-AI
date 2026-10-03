import type { MetadataRoute } from "next";
import { navItems, site } from "@/content/site";
import { projectSlugs } from "@/content/projects";

type Entry = MetadataRoute.Sitemap[number];
type ChangeFrequency = NonNullable<Entry["changeFrequency"]>;

/** Per-route weighting. Anything not listed falls back to the default below. */
const routeWeight: Record<
  string,
  { priority: number; changeFrequency: ChangeFrequency }
> = {
  "/": { priority: 1, changeFrequency: "monthly" },
  "/work": { priority: 0.9, changeFrequency: "monthly" },
  "/about": { priority: 0.8, changeFrequency: "yearly" },
  "/resume": { priority: 0.8, changeFrequency: "yearly" },
  "/research": { priority: 0.7, changeFrequency: "monthly" },
  "/experience": { priority: 0.7, changeFrequency: "yearly" },
  "/skills": { priority: 0.7, changeFrequency: "yearly" },
  "/contact": { priority: 0.6, changeFrequency: "yearly" },
};

const fallback = { priority: 0.5, changeFrequency: "yearly" as ChangeFrequency };

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = navItems.map((item) => {
    const weight = routeWeight[item.href] ?? fallback;
    return {
      url: `${site.url}${item.href === "/" ? "" : item.href}`,
      lastModified,
      changeFrequency: weight.changeFrequency,
      priority: weight.priority,
    };
  });

  const caseStudies: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${site.url}/work/${slug}`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...caseStudies];
}
