import React from "react";
import { Input } from "@/components/base/ui";
import { createUser } from "@/api/actions";
import { cn } from "@/lib/utils";

export const CreateUser = () => {
  return (
    <form action={createUser}>
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
    </form>
  );
};
