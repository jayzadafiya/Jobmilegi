"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n";

interface JobCardProps {
  job: {
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
    imageUrl?: string;
    views: number;
  };
  isNew?: boolean;
  isHot?: boolean;
}

export default function JobCard({
  job,
  isNew = false,
  isHot = false,
}: JobCardProps) {
  const t = useTranslations("jobCard");
  const tCategories = useTranslations("categories");

  const categoryColors: { [key: string]: string } = {
    railway: "bg-blue-100 text-blue-800",
    ssc: "bg-green-100 text-green-800",
    bank: "bg-yellow-100 text-yellow-800",
    police: "bg-red-100 text-red-800",
    stateGovt: "bg-purple-100 text-purple-800",
    defenseJobs: "bg-orange-100 text-orange-800",
    teachingJobs: "bg-indigo-100 text-indigo-800",
    engineeringJobs: "bg-pink-100 text-pink-800",
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("hi-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isExpiring = () => {
    const expiryDate = new Date(job.expiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header with badges */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-wrap gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                categoryColors[job.category] || "bg-gray-100 text-gray-800"
              }`}
            >
              {tCategories(job.category)}
            </span>
            {isNew && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                {t("newJob")}
              </span>
            )}
            {isHot && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {t("hotJob")}
              </span>
            )}
            {isExpiring() && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                जल्दी करें
              </span>
            )}
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {job.views}
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-4">
          {/* Image */}
          {job.imageUrl && (
            <div className="flex-shrink-0 w-20 h-20 relative">
              <Image
                src={job.imageUrl}
                alt={job.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">
              {job.title}
            </h3>

            {job.subtitle && (
              <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                {job.subtitle}
              </p>
            )}

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {job.shortDescription}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {t("posted")}: {formatDate(job.publishDate)}
              </div>
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {t("expires")}: {formatDate(job.expiryDate)}
              </div>
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {job.location}
              </div>
            </div>

            <Link
              href={{
                pathname: "/jobs/[slug]",
                params: { slug: job.slug },
              }}
              className="inline-flex items-center px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {t("viewDetails")}
              <svg
                className="ml-2 w-4 h-4"
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
        </div>
      </div>
    </div>
  );
}
