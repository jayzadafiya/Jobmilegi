"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/axios";
import JobForm from "@/components/admin/JobForm";

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const job = await adminApi.getJob(params.id);

        const expiryDate = job.expiryDate
          ? new Date(job.expiryDate).toISOString().split("T")[0]
          : "";

        setInitialData({
          title: job.title || "",
          shortDescription: job.shortDescription || "",
          category: job.category || "",
          jobType: job.jobType || "",
          location: job.location || "",
          expiryDate,
          description: job.descriptionHtml || "",
          applicationProcess: job.applicationProcess || "",
          importantDates: job.importantDates || "",
          howToApply: job.howToApply || "",
          tags: job.tags || [],
          imageUrl: job.imageUrl || "",
          youtubeUrl: job.youtubeUrl || "",
          metaTitle: job.metaTitle || "",
          metaDescription: job.metaDescription || "",
          metaKeywords: job.metaKeywords || [],
          isPublished: job.isPublished ?? true,
        });
      } catch (error: any) {
        alert("Failed to load job data");
        router.push("/admin/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [params.id, router]);

  const handleSubmit = async (jobData: any) => {
    setIsSaving(true);

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

      await adminApi.updateJob(params.id, apiData);
      alert("Job updated successfully!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      alert(error.message || "Failed to update job");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job data...</p>
        </div>
      </div>
    );
  }

  return (
    <JobForm
      initialData={initialData}
      onSubmit={handleSubmit}
      isSaving={isSaving}
      onCancel={() => router.push("/admin/dashboard")}
      pageTitle="Edit Job"
    />
  );
}
