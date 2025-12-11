import { Suspense } from "react";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
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

// Mock jobs data - replace with actual API call
const mockJobs = [
  {
    _id: "1",
    title: "Indian Railway Group D Recruitment 2024",
    slug: "indian-railway-group-d-recruitment-2024",
    subtitle: "1,03,769 Posts Available",
    shortDescription:
      "Railway Recruitment Board (RRB) has released notification for Group D recruitment. Apply online for various posts including Track Maintainer, Helper, Assistant Pointsman.",
    category: "railway",
    jobType: "latest",
    publishDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    location: "All India",
    views: 15420,
    imageUrl: "/images/railway-logo.png",
  },
  {
    _id: "2",
    title: "SSC CHSL 2024 Notification Released",
    slug: "ssc-chsl-2024-notification-released",
    subtitle: "3,712 Vacancies",
    shortDescription:
      "Staff Selection Commission has released notification for Combined Higher Secondary Level Examination 2024. Apply for LDC, JSA, PA, SA, and DEO posts.",
    category: "ssc",
    jobType: "latest",
    publishDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    location: "All India",
    views: 8934,
    imageUrl: "/images/ssc-logo.png",
  },
  {
    _id: "3",
    title: "Bank PO Recruitment 2024",
    slug: "bank-po-recruitment-2024",
    subtitle: "Multiple Banks - 2,500+ Posts",
    shortDescription:
      "Various public sector banks have announced recruitment for Probationary Officer positions. Great opportunity for banking career aspirants.",
    category: "bank",
    jobType: "latest",
    publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    location: "All India",
    views: 12350,
    imageUrl: "/images/bank-logo.png",
  },
  {
    _id: "4",
    title: "Police Constable Recruitment 2024",
    slug: "police-constable-recruitment-2024",
    subtitle: "State Police - 5,000+ Vacancies",
    shortDescription:
      "State police departments across India are recruiting constables. Physical and written test required. Apply before deadline.",
    category: "police",
    jobType: "latest",
    publishDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Multiple States",
    views: 9876,
    imageUrl: "/images/police-logo.png",
  },
];

async function getJobs(filters: any) {
  // This would normally call your API
  let filteredJobs = [...mockJobs];

  if (filters.category) {
    filteredJobs = filteredJobs.filter(
      (job) => job.category === filters.category
    );
  }

  if (filters.type) {
    filteredJobs = filteredJobs.filter((job) => job.jobType === filters.type);
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredJobs = filteredJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm) ||
        job.shortDescription.toLowerCase().includes(searchTerm)
    );
  }

  return {
    jobs: filteredJobs,
    total: filteredJobs.length,
    page: parseInt(filters.page || "1"),
    totalPages: Math.ceil(filteredJobs.length / 10),
  };
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

function JobsFilter({ searchParams }: { searchParams: any }) {
  const categories = [
    { key: "all", label: "All Categories" },
    { key: "railway", label: "Railway" },
    { key: "ssc", label: "SSC" },
    { key: "bank", label: "Bank" },
    { key: "police", label: "Police" },
    { key: "stateGovt", label: "State Govt" },
    { key: "defenseJobs", label: "Defense" },
    { key: "teachingJobs", label: "Teaching" },
    { key: "engineeringJobs", label: "Engineering" },
  ];

  const types = [
    { key: "all", label: "All Types" },
    { key: "latest", label: "Latest Jobs" },
    { key: "admitCard", label: "Admit Cards" },
    { key: "result", label: "Results" },
    { key: "answerKey", label: "Answer Keys" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Jobs</h2>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
            defaultValue={searchParams.category || "all"}
          >
            {categories.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
            defaultValue={searchParams.type || "all"}
          >
            {types.map((type) => (
              <option key={type.key} value={type.key}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
            defaultValue={searchParams.search || ""}
          />
        </div>
      </div>

      <div className="mt-4">
        <button className="bg-navy-900 hover:bg-navy-800 text-white px-6 py-2 rounded-lg transition-colors">
          Apply Filters
        </button>
      </div>
    </div>
  );
}

export default async function JobsPage({
  params,
  searchParams,
}: JobsPageProps) {
  const { jobs, total, page, totalPages } = await getJobs(searchParams);

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
              {jobs.map((job, index) => (
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
                  {jobs.slice(0, 3).map((job) => (
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
