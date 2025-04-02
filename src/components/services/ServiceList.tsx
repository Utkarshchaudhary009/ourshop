"use client";

import React from "react";
import { useServices } from "@/lib/hooks";
import Image from "next/image";
import Link from "next/link";

interface ServiceListProps {
  category?: string;
  featured?: boolean;
}

export const ServiceList = ({ category, featured }: ServiceListProps) => {
  const { data: services, isLoading, error } = useServices({ category, featured });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, index) => (
          <div 
            key={index} 
            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-64"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
        Error loading services: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
          No services found
        </h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <div 
          key={service._id} 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
        >
          <div className="relative h-48 w-full">
            <Image
              src={service.image}
              alt={service.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{service.name}</h3>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                ${service.price}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
              {service.description}
            </p>
            {service.category && (
              <div className="text-xs inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full mb-2">
                {service.category}
              </div>
            )}
            <Link 
              href={`/services/${service._id}`}
              className="block w-full text-center mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}; 