import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import AdSenseUnit from "@/components/AdSenseUnit";
import { Link } from "@/lib/i18n";
import dbConnect from "@/lib/mongodb";
import Job from "@/lib/models/Job";

// Fetch latest jobs from database
async function getLatestJobs() {
  try {
    await dbConnect();
    const jobs = await Job.find({ isPublished: true })
      .select("-descriptionHtml")
      .sort({ publishDate: -1 })
      .limit(6)
      .lean();
    return JSON.parse(JSON.stringify(jobs));
  } catch (error) {
    console.error("Error fetching latest jobs:", error);
    return [];
  }
}

// Get category counts from database
async function getCategoryCounts() {
  try {
    await dbConnect();
    const categories = await Job.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const categoriesMap: Record<string, number> = {};
    categories.forEach((cat) => {
      categoriesMap[cat._id] = cat.count;
    });

    return categoriesMap;
  } catch (error) {
    console.error("Error fetching category counts:", error);
    return {};
  }
}

export const metadata: Metadata = {
  title: "नवीनतम सरकारी नौकरी अधिसूचनाएं - JobMilegi.in",
  description:
    "भारत की सबसे अपडेट सरकारी नौकरी वेबसाइट। रेलवे, SSC, बैंक, पुलिस और अन्य सरकारी नौकरी की जानकारी पाएं।",
};

export default async function HomePage() {
  const t = await getTranslations("home");
  const latestJobs = await getLatestJobs();
  const categoryCounts = await getCategoryCounts();

  const categories = [
    {
      name: "Railway",
      key: "railway",
      count: categoryCounts.railway || 0,
      icon: "🚂",
    },
    { name: "SSC", key: "ssc", count: categoryCounts.ssc || 0, icon: "📚" },
    { name: "Bank", key: "bank", count: categoryCounts.bank || 0, icon: "🏦" },
    {
      name: "Police",
      key: "police",
      count: categoryCounts.police || 0,
      icon: "👮",
    },
    {
      name: "State Govt",
      key: "stateGovt",
      count: categoryCounts.stateGovt || 0,
      icon: "🏛️",
    },
    {
      name: "Defense",
      key: "defenseJobs",
      count: categoryCounts.defenseJobs || 0,
      icon: "⚔️",
    },
    {
      name: "Teaching",
      key: "teachingJobs",
      count: categoryCounts.teachingJobs || 0,
      icon: "👨‍🏫",
    },
    {
      name: "Engineering",
      key: "engineeringJobs",
      count: categoryCounts.engineeringJobs || 0,
      icon: "⚙️",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t("title")}
            </h1>
            <p className="text-xl text-gray-200 mb-8">{t("subtitle")}</p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("search")}
                  className="w-full px-6 py-4 pr-12 rounded-full text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-400"
                />
                <button className="absolute right-2 top-2 bg-accent-400 hover:bg-accent-500 text-white p-2 rounded-full transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Categories */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t("categories")}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.key}
                    className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-3">{category.icon}</div>
                      <h3 className="font-medium text-gray-900 group-hover:text-navy-700">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {category.count} {category.count === 1 ? "job" : "jobs"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Ad Space */}
            <div className="mb-8">
              <AdSenseUnit slot="IN_CONTENT_TOP" className="w-full h-32" />
            </div>

            {/* Latest Jobs */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("latestJobs")}
                </h2>
                <Link
                  href="/jobs"
                  className="text-navy-700 hover:text-navy-900 font-medium flex items-center"
                >
                  {t("viewAll")}
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              <div className="space-y-6">
                {latestJobs.length > 0 ? (
                  latestJobs.slice(0, 3).map((job: any, index: number) => (
                    <div key={job._id}>
                      <JobCard
                        job={job}
                        isNew={index < 2}
                        isHot={job.views > 10000}
                      />
                      {index === 0 && (
                        <div className="my-6">
                          <AdSenseUnit
                            slot="BETWEEN_JOBS"
                            className="w-full h-24"
                          />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                    <p className="text-gray-500">
                      No jobs available at the moment. Check back soon!
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Trending Jobs */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t("trendingJobs")}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {latestJobs.length > 0 ? (
                  latestJobs
                    .slice(3, 6)
                    .map((job: any) => (
                      <JobCard key={job._id} job={job} isHot />
                    ))
                ) : (
                  <div className="col-span-2 bg-white p-8 rounded-xl border border-gray-200 text-center">
                    <p className="text-gray-500">
                      No trending jobs at the moment.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Bottom Ad */}
            <div className="mb-8">
              <AdSenseUnit slot="BOTTOM_CONTENT" className="w-full h-48" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Sidebar Ad */}
              <AdSenseUnit slot="SIDEBAR_TOP" className="w-full h-96" />

              {/* Quick Links */}
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Quick Links
                </h3>
                <div className="space-y-2">
                  {[
                    "Admit Cards",
                    "Results",
                    "Answer Keys",
                    "Syllabus",
                    "Previous Papers",
                  ].map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="block text-gray-600 hover:text-navy-700 py-1 transition-colors"
                    >
                      {link}
                    </a>
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
