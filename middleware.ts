import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Define paths that require admin access
const adminRoutes = ["/admin", "/api/admin"];

export async function middleware(req: NextRequest) {
    // Extract token from NextAuth session
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If no token, redirect to login page
    if (!token) {
        return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }

    // Check if the route requires admin access
    const isAdminRoute = adminRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

    if (isAdminRoute) {
        // Ensure the user is an admin
        if (token.role !== "admin") {
            // Redirect unauthorized users to the home page
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next(); // Allow the request to proceed
}

// Apply middleware to specific paths
export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"], // Apply to all admin routes
};
