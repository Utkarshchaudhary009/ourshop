import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Service } from "@/lib/models";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { ServiceRequestSchema } from "@/lib/types";
import mongoose from "mongoose";

// GET /api/services/[id] - Get a single service by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid service ID format" },
        { status: 400 }
      );
    }
    
    await connectToDB();
    
    const service = await Service.findById(id);
    
    if (!service) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { message: "Error fetching service" },
      { status: 500 }
    );
  }
}

// PUT /api/services/[id] - Update a service by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const id = params.id;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid service ID format" },
        { status: 400 }
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
    
    // Check if service exists
    const existingService = await Service.findById(id);
    if (!existingService) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }
    
    // Update service
    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        ...validationResult.data,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedService, { status: 200 });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { message: "Error updating service" },
      { status: 500 }
    );
  }
}

// DELETE /api/services/[id] - Delete a service by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const id = params.id;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid service ID format" },
        { status: 400 }
      );
    }
    
    await connectToDB();
    
    // Check if service exists
    const existingService = await Service.findById(id);
    if (!existingService) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }
    
    // Delete service
    await Service.findByIdAndDelete(id);
    
    return NextResponse.json(
      { message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { message: "Error deleting service" },
      { status: 500 }
    );
  }
} 