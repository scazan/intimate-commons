"use client";
import React, { useTransition } from "react";
import { Button } from "@/components/base/ui";
import { CreateUser } from "..";
import { verifyUserAndNavigate } from "@/api/actions";
import { cn } from "@/lib/utils";
import { LoadingCircle } from "@/components/LoadingCircle";

export const ChooseUser = ({ className, userId, userName }) => {
  const [isTransitioning, startTransition] = useTransition();
  const searchParams = new URLSearchParams(window.location.search);

  const start = async () => {
    const group = searchParams.get("gid");
    startTransition(async () => {
      await verifyUserAndNavigate(group);
    });
  };

  return userId && userName ? (
    <form action={start}>
      {isTransitioning ? (
        <LoadingCircle className="w-12 h-12" />
      ) : (
        <Button
          className={cn("uppercase", className)}
          variant="large"
          type="submit"
        >
          Begin the experience
        </Button>
      )}
    </form>
  ) : (
    <CreateUser />
  );
};
