"use client";

import React from "react";
import { useService } from "@/lib/hooks";
import Image from "next/image";
import Link from "next/link";

interface ServiceDetailProps {
  id: string;
}

export const ServiceDetail = ({ id }: ServiceDetailProps) => {
  const { data: service, isLoading, error } = useService(id);

  if (isLoading) {
    return (
      <div className='w-full max-w-4xl mx-auto p-4 animate-pulse'>
        <div className='h-80 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6' />
        <div className='h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 mb-4' />
        <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4 mb-8' />
        <div className='space-y-3'>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded-lg' />
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded-lg' />
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded-lg' />
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3' />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full max-w-4xl mx-auto p-4'>
        <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-500'>
          Error loading service:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
        <Link
          href='/services'
          className='mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          Back to Services
        </Link>
      </div>
    );
  }

  if (!service) {
    return (
      <div className='w-full max-w-4xl mx-auto p-4 text-center'>
        <h2 className='text-2xl font-bold mb-4'>Service Not Found</h2>
        <p className='text-gray-600 dark:text-gray-300 mb-6'>
          The service you are looking for does not exist or has been removed.
        </p>
        <Link
          href='/services'
          className='inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className='w-full max-w-4xl mx-auto p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden'>
        <div className='relative h-80 w-full'>
          <Image
            src={service.image}
            alt={service.name}
            fill
            className='object-cover'
            priority
          />
        </div>
        <div className='p-6'>
          <div className='flex flex-col md:flex-row justify-between md:items-center mb-6'>
            <h1 className='text-3xl font-bold mb-2 md:mb-0'>{service.name}</h1>
            <div className='flex items-center'>
              <span className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                ${service.price}
              </span>
            </div>
          </div>

          {service.category && (
            <div className='mb-4'>
              <span className='text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full'>
                {service.category}
              </span>
            </div>
          )}

          <div className='prose dark:prose-invert max-w-none'>
            <p className='text-gray-700 dark:text-gray-300 whitespace-pre-line'>
              {service.description}
            </p>
          </div>

          <div className='mt-8 flex space-x-4'>
            <Link
              href='/contact'
              className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              Request This Service
            </Link>
            <Link
              href='/services'
              className='px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
            >
              Back to Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
