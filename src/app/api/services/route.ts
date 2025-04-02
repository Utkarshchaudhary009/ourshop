import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Service } from "@/lib/models";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { ServiceRequestSchema } from "@/lib/types";

// GET /api/services - Get all services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    
    await connectToDB();
    
    // Build filter based on query params
    const filter: any = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (featured === "true") {
      filter.featured = true;
    }
    
    const services = await Service.find(filter).sort({ createdAt: -1 });
    
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { message: "Error fetching services" },
      { status: 500 }
    );
  }
}

// POST /api/services - Create a new service
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate request body
    const validationResult = ServiceRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid request data", errors: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    await connectToDB();
    
    // Create new service
    const newService = new Service({
      ...validationResult.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    await newService.save();
    
    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { message: "Error creating service" },
      { status: 500 }
    );
  }
} 