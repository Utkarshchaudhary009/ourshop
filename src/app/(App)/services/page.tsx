"use client";

import { useState } from "react";
import { useGetServices } from "@/lib/api/services/serviceService";
import { IService } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MessageSquare, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Contact form schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  serviceInterest: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ServicesPage() {
  const { data: services, isLoading: isLoadingServices } = useGetServices();
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const [openContactDialog, setOpenContactDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, touchedFields },
    reset,
    setValue,
    trigger,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      serviceInterest: "",
      message: "",
    },
    mode: "onChange", // Validate on change
  });

  const handleContactRequest = (service: IService) => {
    setSelectedService(service);
    setValue("serviceInterest", service.name);
    setOpenContactDialog(true);
  };

  const onSubmitContactForm = async (data: ContactFormData) => {
    try {
      // Here you would typically send the data to your API
      // For now we'll just simulate it with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Your inquiry has been sent! We'll be in touch soon.");
      reset();
      setOpenContactDialog(false);
    } catch (error) {
      toast.error("Failed to send inquiry. Please try again later.");
      console.error("Contact form error:", error);
    }
  };

  // Check if there are any form errors
  const hasFormErrors = Object.keys(errors).length > 0;

  if (isLoadingServices) {
    return (
      <div className="container py-12 space-y-8">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-1/3 mx-auto" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-52 w-full" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Our Services</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We offer a range of professional services to meet your needs. Browse our offerings below and get in touch to learn more.
        </p>
      </div>

      {services && services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service._id} className="overflow-hidden flex flex-col h-full">
              <div className="relative">
                <AspectRatio ratio={16 / 9}>
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover transition-all hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <p className="text-muted-foreground">No image available</p>
                    </div>
                  )}
                </AspectRatio>
                {service.featured && (
                  <Badge className="absolute top-2 right-2 bg-primary">
                    Featured
                  </Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>
                  ${service.price.toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="line-clamp-3">{service.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Learn More</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{service.name}</DialogTitle>
                      <DialogDescription>
                        ${service.price.toFixed(2)}
                      </DialogDescription>
                    </DialogHeader>
                    {service.image && (
                      <div className="relative w-full aspect-video overflow-hidden rounded-md">
                        <Image
                          src={service.image}
                          alt={service.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <p>{service.description}</p>
                      <Button 
                        className="w-full mt-4"
                        onClick={() => handleContactRequest(service)}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Inquire About This Service
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button onClick={() => handleContactRequest(service)}>
                  Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No services available at the moment</p>
          <p className="mt-2">Please check back later for our upcoming services</p>
        </div>
      )}

      {/* Contact Form Dialog */}
      <Dialog open={openContactDialog} onOpenChange={setOpenContactDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Contact Us About Our Services</DialogTitle>
            <DialogDescription>
              {selectedService 
                ? `Fill out the form below to inquire about our ${selectedService.name} service.`
                : "Fill out the form below to get in touch with us about our services."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitContactForm)} className="space-y-4">
            {/* Form validation error summary */}
            {hasFormErrors && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Please fix the following issues:
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    {errors.name && <li>{errors.name.message}</li>}
                    {errors.email && <li>{errors.email.message}</li>}
                    {errors.serviceInterest && <li>{errors.serviceInterest.message}</li>}
                    {errors.message && <li>{errors.message.message}</li>}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input 
                  id="name" 
                  {...register("name")} 
                  className={errors.name ? "border-red-500" : ""} 
                  onBlur={() => trigger("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  {...register("email")} 
                  className={errors.email ? "border-red-500" : ""} 
                  onBlur={() => trigger("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceInterest">Service of Interest</Label>
              <Input 
                id="serviceInterest" 
                {...register("serviceInterest")} 
                readOnly={!!selectedService}
                className={errors.serviceInterest ? "border-red-500" : ""} 
              />
              {errors.serviceInterest && (
                <p className="text-sm text-red-500">{errors.serviceInterest.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea 
                id="message" 
                {...register("message")} 
                rows={5} 
                placeholder="Please let us know what you're looking for and any specific requirements you have."
                className={errors.message ? "border-red-500" : ""} 
                onBlur={() => trigger("message")}
              />
              {errors.message && (
                <p className="text-sm text-red-500">{errors.message.message}</p>
              )}
            </div>
            <div className="flex justify-end gap-4 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpenContactDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || hasFormErrors}>
                {isSubmitting ? "Sending..." : "Send Inquiry"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
