"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ServiceSchema } from "@/lib/types";
import { IService } from "@/lib/types";
import { useCreateService, useUpdateService } from "@/lib/hooks";
import { useRouter } from "next/navigation";

// Create a subset of ServiceSchema for the form
const FormSchema = ServiceSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

type FormValues = z.infer<typeof FormSchema>;

interface ServiceFormProps {
  service?: IService;
  isEdit?: boolean;
}

export const ServiceForm = ({ service, isEdit = false }: ServiceFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get mutation hooks
  const createMutation = useCreateService();
  const updateMutation = useUpdateService(service?._id || "");

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues:
      isEdit && service
        ? {
            name: service.name,
            description: service.description,
            image: service.image,
            price: service.price,
            featured: service.featured,
            category: service.category || "",
          }
        : {
            name: "",
            description: "",
            image: "",
            price: 0,
            featured: false,
            category: "",
          },
  });

  // Reset form when service prop changes
  useEffect(() => {
    if (isEdit && service) {
      reset({
        name: service.name,
        description: service.description,
        image: service.image,
        price: service.price,
        featured: service.featured,
        category: service.category || "",
      });
    }
  }, [isEdit, service, reset]);

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      if (isEdit && service?._id) {
        // Update existing service
        await updateMutation.mutateAsync(data);
        router.push(`/admin/services/${service._id}`);
      } else {
        // Create new service
        await createMutation.mutateAsync(data);
        router.push("/admin/services");
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-6'
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <label
            htmlFor='name'
            className='block text-sm font-medium'
          >
            Service Name
          </label>
          <input
            id='name'
            type='text'
            {...register("name")}
            className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='Enter service name'
          />
          {errors.name && (
            <p className='text-red-500 text-sm'>{errors.name.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <label
            htmlFor='price'
            className='block text-sm font-medium'
          >
            Price ($)
          </label>
          <input
            id='price'
            type='number'
            step='0.01'
            min='0'
            {...register("price", { valueAsNumber: true })}
            className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='Enter price'
          />
          {errors.price && (
            <p className='text-red-500 text-sm'>{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        <label
          htmlFor='category'
          className='block text-sm font-medium'
        >
          Category
        </label>
        <input
          id='category'
          type='text'
          {...register("category")}
          className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          placeholder='Enter category (optional)'
        />
        {errors.category && (
          <p className='text-red-500 text-sm'>{errors.category.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <label
          htmlFor='image'
          className='block text-sm font-medium'
        >
          Image URL
        </label>
        <input
          id='image'
          type='url'
          {...register("image")}
          className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          placeholder='Enter image URL'
        />
        {errors.image && (
          <p className='text-red-500 text-sm'>{errors.image.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <label
          htmlFor='description'
          className='block text-sm font-medium'
        >
          Description
        </label>
        <textarea
          id='description'
          rows={5}
          {...register("description")}
          className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          placeholder='Enter service description'
        />
        {errors.description && (
          <p className='text-red-500 text-sm'>{errors.description.message}</p>
        )}
      </div>

      <div className='flex items-center space-x-2'>
        <input
          id='featured'
          type='checkbox'
          {...register("featured")}
          className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
        />
        <label
          htmlFor='featured'
          className='text-sm font-medium'
        >
          Feature this service
        </label>
      </div>

      <div className='flex space-x-4'>
        <button
          type='submit'
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : isEdit
            ? "Update Service"
            : "Create Service"}
        </button>
        <button
          type='button'
          className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors'
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
