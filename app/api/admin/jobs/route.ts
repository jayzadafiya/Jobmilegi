import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Job from "@/lib/models/Job";
import Admin from "@/lib/models/Admin";
import jwt from "jsonwebtoken";

// Helper to verify admin token
async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("admin-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      adminId: string;
    };

    await connectToDatabase();
    const admin = await Admin.findById(decoded.adminId);

    if (!admin || !admin.isActive) {
      return null;
    }

    return admin;
  } catch (error) {
    return null;
  }
}

// GET - Get all jobs (admin)
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(100).lean();

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// POST - Create new job
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Debug: Log received data
    console.log("📥 Received job data:", {
      title: data.title,
      hasApplicationProcess: !!data.applicationProcess,
      hasImportantDates: !!data.importantDates,
      hasHowToApply: !!data.howToApply,
      applicationProcessLength: data.applicationProcess?.length || 0,
      importantDatesLength: data.importantDates?.length || 0,
      howToApplyLength: data.howToApply?.length || 0,
    });

    await connectToDatabase();
    const job = await Job.create({
      ...data,
      slug: data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
      createdBy: admin._id,
    });

    console.log("✅ Job created:", job._id);

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
