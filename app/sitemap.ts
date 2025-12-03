import { MetadataRoute } from "next";
import dbConnect from "@/lib/mongodb";
import Job from "@/lib/models/Job";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jobmilegi.in";

  try {
    await dbConnect();

    // Get all published jobs
    const jobs = await Job.find({ isPublished: true })
      .select("slug updatedAt")
      .sort({ updatedAt: -1 })
      .lean();

    const locales = ["hi", "en", "mr", "bn", "ta", "te", "gu"];

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [];

    locales.forEach((locale) => {
      staticRoutes.push(
        {
          url: `${baseUrl}/${locale}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 1,
        },
        {
          url: `${baseUrl}/${locale}/jobs`,
          lastModified: new Date(),
          changeFrequency: "hourly",
          priority: 0.9,
        }
      );
    });

    // Job detail routes
    const jobRoutes: MetadataRoute.Sitemap = [];

    jobs.forEach((job) => {
      locales.forEach((locale) => {
        jobRoutes.push({
          url: `${baseUrl}/${locale}/jobs/${job.slug}`,
          lastModified: new Date(job.updatedAt),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      });
    });

    return [...staticRoutes, ...jobRoutes];
  } catch (error) {
    console.error("Sitemap generation error:", error);

    // Return basic sitemap if database fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }
}
