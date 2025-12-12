import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("hi-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const categoryColors: { [key: string]: string } = {
  railway: "bg-blue-100 text-blue-800",
  ssc: "bg-green-100 text-green-800",
  bank: "bg-yellow-100 text-yellow-800",
  police: "bg-red-100 text-red-800",
  stateGovt: "bg-purple-100 text-purple-800",
  defenseJobs: "bg-orange-100 text-orange-800",
  teachingJobs: "bg-indigo-100 text-indigo-800",
  engineeringJobs: "bg-pink-100 text-pink-800",
};
