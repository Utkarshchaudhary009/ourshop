"use client";

import React, { useState } from "react";
import { useDeleteService } from "@/lib/hooks";
import { useRouter } from "next/navigation";

interface DeleteServiceButtonProps {
  serviceId: string;
  serviceName: string;
}

export const DeleteServiceButton = ({
  serviceId,
  serviceName,
}: DeleteServiceButtonProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const router = useRouter();
  const deleteMutation = useDeleteService();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(serviceId);
      router.push("/admin/services");
    } catch (error) {
      console.error("Error deleting service:", error);
    } finally {
      setIsConfirmOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsConfirmOpen(true)}
        className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'
        aria-label='Delete service'
      >
        Delete Service
      </button>

      {isConfirmOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6'>
            <h3 className='text-xl font-bold mb-4'>Confirm Deletion</h3>
            <p className='mb-6'>
              Are you sure you want to delete &quot;{serviceName}&quot;? This
              action cannot be undone.
            </p>
            <div className='flex space-x-4 justify-end'>
              <button
                onClick={() => setIsConfirmOpen(false)}
                className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
