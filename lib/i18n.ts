import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "hi", "mr", "bn", "ta", "te", "gu"],

  // Used when no locale matches
  defaultLocale: "hi",

  pathnames: {
    "/": "/",
    "/jobs": "/jobs",
    "/jobs/[slug]": "/jobs/[slug]",
  },
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
