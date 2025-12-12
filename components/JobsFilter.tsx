"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

interface JobsFilterProps {
  searchParams: any;
}

export default function JobsFilter({ searchParams }: JobsFilterProps) {
  const router = useRouter();
  const categoryRef = useRef<HTMLSelectElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

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

  const handleApplyFilters = () => {
    const category = categoryRef.current?.value || "all";
    const type = typeRef.current?.value || "all";
    const search = searchRef.current?.value || "";

    const params = new URLSearchParams();
    if (category !== "all") params.append("category", category);
    if (type !== "all") params.append("type", type);
    if (search) params.append("search", search);

    const queryString = params.toString();
    const url = queryString ? `/jobs?${queryString}` : "/jobs";
    router.push(url);
  };

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
            ref={categoryRef}
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
            ref={typeRef}
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
            ref={searchRef}
            type="text"
            placeholder="Search jobs..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
            defaultValue={searchParams.search || ""}
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleApplyFilters}
          className="bg-navy-900 hover:bg-navy-800 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
