import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import AdSenseUnit from "@/components/AdSenseUnit";
import dbConnect from "@/lib/mongodb";
import Job from "@/lib/models/Job";
import JobCard from "@/components/JobCard";

interface JobDetailPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

async function getJob(slug: string) {
  try {
    await dbConnect();
    const job = await Job.findOne({ slug, isPublished: true }).lean();

    if (job) {
      await Job.findByIdAndUpdate(job._id, { $inc: { views: 1 } });
      return JSON.parse(JSON.stringify(job));
    }
    return null;
  } catch (error) {
    console.error("Error fetching job:", error);
    return null;
  }
}

async function getRelatedJobs(category: string, currentJobId: string) {
  try {
    await dbConnect();
    const jobs = await Job.find({
      isPublished: true,
      category,
      _id: { $ne: currentJobId },
    })
      .select("-descriptionHtml")
      .sort({ publishDate: -1 })
      .limit(4)
      .lean();
    return JSON.parse(JSON.stringify(jobs));
  } catch (error) {
    console.error("Error fetching related jobs:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const job = await getJob(params.slug);

  if (!job) {
    return {
      title: "Job Not Found",
    };
  }

  return {
    title: job.metaTitle || job.title,
    description: job.metaDescription || job.shortDescription,
    keywords: job.metaKeywords,
    openGraph: {
      title: job.title,
      description: job.shortDescription,
      images: job.imageUrl ? [job.imageUrl] : [],
      type: "article",
    },
    alternates: {
      canonical: `/${params.locale}/jobs/${job.slug}`,
    },
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const job = await getJob(params.slug);
  const t = await getTranslations("jobDetails");

  if (!job) {
    notFound();
  }
  const relatedJobs = await getRelatedJobs(job.category, job._id.toString());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("hi-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.shortDescription,
    datePosted: job.publishDate,
    validThrough: job.expiryDate,
    employmentType: job.jobType,
    hiringOrganization: {
      "@type": "Organization",
      name: "JobMilegi.in",
      sameAs: "https://jobmilegi.in",
    },
    jobLocation: {
      "@type": "Place",
      name: job.location,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start gap-4">
                  {job.imageUrl && (
                    <div className="flex-shrink-0 w-16 h-16 relative">
                      <Image
                        src={job.imageUrl}
                        alt={job.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h1>
                    {job.subtitle && (
                      <h2 className="text-lg text-gray-600 mb-3">
                        {job.subtitle}
                      </h2>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span>📅 {formatDate(job.publishDate)}</span>
                      <span>📍 {job.location}</span>
                      <span>👀 {job.views.toLocaleString()} views</span>
                      <span>⏰ Expires: {formatDate(job.expiryDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-700">{job.shortDescription}</p>
                </div>
                {job.tags && job.tags.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {job.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mb-6">
                  <AdSenseUnit slot="IN_CONTENT_TOP" className="w-full h-32" />
                </div>

                <div
                  className="job-content prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
                />

                {job.applicationProcess && (
                  <div className="mt-8">
                    <div
                      className="job-content prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: job.applicationProcess,
                      }}
                    />
                  </div>
                )}

                {job.importantDates && (
                  <div className="mt-8">
                    <div
                      className="job-content prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
                      dangerouslySetInnerHTML={{ __html: job.importantDates }}
                    />
                  </div>
                )}

                {job.howToApply && (
                  <div className="mt-8">
                    <div
                      className="job-content prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
                      dangerouslySetInnerHTML={{ __html: job.howToApply }}
                    />
                  </div>
                )}

                <div className="mt-8 mb-6">
                  <AdSenseUnit
                    slot="IN_CONTENT_MIDDLE"
                    className="w-full h-32"
                  />
                </div>

                {job.youtubeUrl && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Related Video
                    </h3>
                    <div className="aspect-video">
                      <iframe
                        src={job.youtubeUrl}
                        className="w-full h-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <AdSenseUnit slot="BOTTOM_CONTENT" className="w-full h-48" />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {t("relatedJobs")}
              </h3>
              {relatedJobs.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedJobs.map((relatedJob: any) => (
                    <JobCard key={relatedJob._id} job={relatedJob} />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                  <p className="text-gray-500">No related jobs found.</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <AdSenseUnit slot="SIDEBAR" className="w-full h-96" />

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{job.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{job.jobType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted:</span>
                    <span className="font-medium">
                      {formatDate(job.publishDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expires:</span>
                    <span className="font-medium text-red-600">
                      {formatDate(job.expiryDate)}
                    </span>
                  </div>
                </div>
              </div>

              <AdSenseUnit slot="SIDEBAR_BOTTOM" className="w-full h-64" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
