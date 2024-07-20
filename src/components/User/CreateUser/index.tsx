"use client";
import React, { useTransition } from "react";
import { Input } from "@/components/base/ui";
import { createUser } from "@/api/actions";
import { cn } from "@/lib/utils";
import { LoadingCircle } from "@/components/LoadingCircle";

export const CreateUser = () => {
  const [isTransitioning, startTransition] = useTransition();

  const start = async (data) => {
    startTransition(async () => {
      await createUser(data);
    });
  };

  return (
    <form action={start}>
      {isTransitioning ? (
        <LoadingCircle className="w-12 h-12" />
      ) : (
        <Input
          id="createUser"
          type="text"
          placeholder="What's your name?"
          name="name"
          className={cn(
            "rounded-lg px-6 py-2 h-12",
            "border-primary border bg-background/80",
            "transition-colors font-sans font-extralight uppercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          )}
        />
      )}
    </form>
  );
};
