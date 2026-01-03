"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/axios";
import JobForm from "@/components/admin/JobForm";

export default function AddJobPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (jobData: any) => {
    setIsLoading(true);

    try {
      const apiData = {
        title: jobData.title,
        shortDescription: jobData.shortDescription,
        descriptionHtml: jobData.description,
        applicationProcess: jobData.applicationProcess,
        importantDates: jobData.importantDates,
        howToApply: jobData.howToApply,
        category: jobData.category,
        jobType: jobData.jobType,
        location: jobData.location,
        expiryDate: jobData.expiryDate,
        tags: jobData.tags,
        imageUrl: jobData.imageUrl,
        youtubeUrl: jobData.youtubeUrl,
        metaTitle: jobData.metaTitle || jobData.title,
        metaDescription: jobData.metaDescription || jobData.shortDescription,
        metaKeywords: jobData.metaKeywords,
        isPublished: jobData.isPublished,
      };

      await adminApi.createJob(apiData);
      router.push("/admin/dashboard");
    } catch (error: any) {
      alert(error.message || "Failed to create job");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <JobForm
      onSubmit={handleSubmit}
      isSaving={isLoading}
      onCancel={() => router.push("/admin/dashboard")}
      pageTitle="Add New Job"
    />
  );
}
