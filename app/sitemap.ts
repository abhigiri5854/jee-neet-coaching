import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { COURSES, PAPERS, TEACHERS } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/courses", "/teachers", "/batches", "/about", "/sample-papers"].map(
    (path) => ({
      url: `${SITE.url}${path}`,
      lastModified: new Date(),
    })
  );
  return [
    ...staticRoutes,
    ...COURSES.map((course) => ({
      url: `${SITE.url}/courses/${course.slug}`,
      lastModified: new Date(),
    })),
    ...TEACHERS.map((teacher) => ({
      url: `${SITE.url}/teachers/${teacher.slug}`,
      lastModified: new Date(),
    })),
    ...PAPERS.map((paper) => ({
      url: `${SITE.url}/sample-papers/${paper.slug}`,
      lastModified: new Date(),
    })),
  ];
}
