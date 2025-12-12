import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import JobsFilter from "@/components/JobsFilter";
import AdSenseUnit from "@/components/AdSenseUnit";

interface JobsPageProps {
  params: { locale: string };
  searchParams: {
    page?: string;
    category?: string;
    type?: string;
    search?: string;
  };
}

// Fetch jobs from API
async function getJobs(filters: any) {
  try {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page);
    // default limit to 10 if not provided
    params.append("limit", "10");
    if (filters.category && filters.category !== "all")
      params.append("category", filters.category);
    if (filters.type && filters.type !== "all")
      params.append("type", filters.type);
    if (filters.search) params.append("search", filters.search);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/jobs?${params.toString()}`, {
      // no-store to always get fresh data; for caching, change as necessary
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch jobs from API", await res.text());
      return { jobs: [], total: 0, page: 1, totalPages: 0 };
    }

    const data = await res.json();

    return {
      jobs: data.jobs || [],
      total: data.pagination?.total ?? 0,
      page: data.pagination?.page ?? 1,
      totalPages: data.pagination?.pages ?? 0,
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return { jobs: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: JobsPageProps): Promise<Metadata> {
  const t = await getTranslations("navigation");

  let title = "सभी सरकारी नौकरियां - JobMilegi.in";
  let description =
    "भारत की सभी नवीनतम सरकारी नौकरी अधिसूचनाएं एक स्थान पर। रेलवे, SSC, बैंक, पुलिस और अन्य विभागों की नौकरियों की जानकारी पाएं।";

  if (searchParams.category) {
    title = `${searchParams.category.toUpperCase()} नौकरियां - JobMilegi.in`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: `/${params.locale}/jobs`,
    },
  };
}

interface Job {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  shortDescription: string;
  category: string;
  jobType: string;
  publishDate: string;
  expiryDate: string;
  location: string;
  views: number;
  imageUrl?: string;
}

export default async function JobsPage({
  params,
  searchParams,
}: JobsPageProps) {
  const {
    jobs,
    total,
    page,
    totalPages,
  }: { jobs: Job[]; total: number; page: number; totalPages: number } | any =
    await getJobs(searchParams);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                सभी सरकारी नौकरियां
              </h1>
              <p className="text-gray-600">
                भारत भर की नवीनतम सरकारी नौकरी अधिसूचनाएं खोजें और अप्लाई करें
              </p>
            </div>

            {/* Filters */}
            <JobsFilter searchParams={searchParams} />

            {/* Ad Space */}
            <div className="mb-8">
              <AdSenseUnit slot="JOBS_PAGE_TOP" className="w-full h-32" />
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                Showing {jobs.length} of {total} jobs
                {searchParams.category && ` in ${searchParams.category}`}
                {searchParams.search && ` for "${searchParams.search}"`}
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                  <option value="latest">Latest First</option>
                  <option value="views">Most Viewed</option>
                  <option value="expiry">Expiry Date</option>
                </select>
              </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-6">
              {jobs.map((job: Job, index: number) => (
                <div key={job._id}>
                  <JobCard
                    job={job}
                    isNew={index < 2}
                    isHot={job.views > 10000}
                  />

                  {/* Ad between jobs */}
                  {(index + 1) % 3 === 0 && (
                    <div className="my-6">
                      <AdSenseUnit
                        slot="BETWEEN_JOBS"
                        className="w-full h-24"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    disabled={page <= 1}
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`px-4 py-2 rounded-lg ${
                        page === i + 1
                          ? "bg-navy-900 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    disabled={page >= totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Ad */}
            <div className="mt-12">
              <AdSenseUnit slot="JOBS_PAGE_BOTTOM" className="w-full h-48" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Sidebar Ad */}
              <AdSenseUnit slot="SIDEBAR" className="w-full h-96" />

              {/* Popular Categories */}
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Popular Categories
                </h3>
                <div className="space-y-2">
                  {["Railway", "SSC", "Bank", "Police", "Teaching"].map(
                    (category) => (
                      <a
                        key={category}
                        href={`/jobs?category=${category.toLowerCase()}`}
                        className="block text-gray-600 hover:text-navy-700 py-1 transition-colors"
                      >
                        {category} Jobs
                      </a>
                    )
                  )}
                </div>
              </div>

              {/* Recent Jobs */}
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Recent Jobs
                </h3>
                <div className="space-y-3">
                  {jobs.slice(0, 3).map((job: Job) => (
                    <div
                      key={job._id}
                      className="border-b border-gray-100 pb-3 last:border-b-0"
                    >
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {job.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(job.publishDate).toLocaleDateString("hi-IN")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Another Sidebar Ad */}
              <AdSenseUnit slot="SIDEBAR_BOTTOM" className="w-full h-64" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
