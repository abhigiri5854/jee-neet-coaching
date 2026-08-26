import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { COURSES, SAMPLE_PAPERS, TEACHERS } from "@/lib/data/catalog";

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
    ...SAMPLE_PAPERS.map((paper) => ({
      url: `${SITE.url}/sample-papers/${paper.slug}`,
      lastModified: new Date(),
    })),
  ];
}
