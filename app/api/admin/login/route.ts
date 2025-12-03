import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/lib/models/Admin";
import { setAdminCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Find admin
    const admin = await Admin.findOne({
      $or: [{ username: username }, { email: username }],
      isActive: true,
    });

    if (!admin || !(await admin.comparePassword(password))) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });

    // Set HTTP-only cookie
    const cookie = setAdminCookie({
      adminId: admin._id.toString(),
      username: admin.username,
      role: admin.role,
    });

    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  // Logout - clear cookie
  const response = NextResponse.json({ success: true });
  response.headers.set(
    "Set-Cookie",
    "admin-token=; HttpOnly; Path=/; Max-Age=0; SameSite=strict"
  );
  return response;
}
