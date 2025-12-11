import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Job from "@/lib/models/Job";

interface RouteContext {
  params: { slug: string };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    await dbConnect();

    const job = await Job.findOne({
      slug: params.slug,
      isPublished: true,
    }).lean();

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Increment view count
    await Job.findByIdAndUpdate(job._id, { $inc: { views: 1 } });

    return NextResponse.json(job);
  } catch (error) {
    console.error("Job detail API error:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}
