import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/lib/models/Admin";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      adminId: string;
    };

    await connectToDatabase();
    const admin = await Admin.findById(decoded.adminId).select("-passwordHash");

    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: "Admin not found" }, { status: 401 });
    }

    return NextResponse.json({ admin });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
