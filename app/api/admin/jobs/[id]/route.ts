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

// GET - Get single job
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const job = await Job.findById(params.id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

// PUT - Update job
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    await connectToDatabase();
    const job = await Job.findByIdAndUpdate(
      params.id,
      {
        ...data,
        updatedBy: admin._id,
      },
      { new: true, runValidators: true }
    );

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

// DELETE - Delete job
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const job = await Job.findByIdAndDelete(params.id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Job deleted" });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
