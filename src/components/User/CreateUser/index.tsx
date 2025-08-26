"use client";
import React, { useTransition, useState } from "react";
import { Input } from "@/components/base/ui";
import { createUser } from "@/api/actions";
import { cn } from "@/lib/utils";
import { LoadingCircle } from "@/components/LoadingCircle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, type CreateUserData } from "@/lib/validation/schemas";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/base/ui/form";
import { getErrorMessage } from "@/lib/errors";

export const CreateUser = () => {
  const [isTransitioning, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateUserData) => {
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        await createUser(formData);
      } catch (err) {
        console.error("Error creating user:", err);
        
        let errorMessage = getErrorMessage(err);
        
        // Provide more specific error messages
        if (err instanceof Error && err.message.includes('Validation failed')) {
          errorMessage = "Please enter a valid name (2-50 characters, letters only).";
        } else if (err instanceof Error && err.message.includes('Network')) {
          errorMessage = "Connection failed. Please check your internet connection.";
        } else if (!errorMessage || errorMessage === "An unexpected error occurred") {
          errorMessage = "Failed to create user. Please try again.";
        }
        
        setError(errorMessage);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {isTransitioning ? (
          <LoadingCircle className="w-12 h-12" />
        ) : (
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id="createUser"
                    type="text"
                    placeholder="What's your name?"
                    {...field}
                    className={cn(
                      "rounded-lg px-6 py-2 h-12",
                      "border-primary border bg-background/80",
                      "transition-colors font-sans font-extralight uppercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                      fieldState.error && "border-red-500"
                    )}
                  />
                </FormControl>
                {fieldState.error && (
                  <FormMessage className="text-red-500 text-sm mt-1">
                    {fieldState.error.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
        )}
        {error && (
          <div className="text-red-500 text-sm mt-2 space-y-2">
            <div>{error}</div>
            {!isTransitioning && (
              <button
                type="button"
                onClick={() => form.handleSubmit(onSubmit)()}
                className="text-blue-500 hover:text-blue-700 underline text-xs"
              >
                Try again
              </button>
            )}
          </div>
        )}
      </form>
    </Form>
  );
};
