import React from "react";
import { Button } from "@/components/base/ui";
import { cookies } from "next/headers";
import { CreateUser } from "..";
import { verifyUserAndNavigate } from "@/api/actions";
import { cn } from "@/lib/utils";

export const ChooseUser = ({ className }) => {
  const userId = cookies().get("userId");
  const userName = cookies().get("userName");

  return userId && userName?.value ? (
    <form action={verifyUserAndNavigate}>
      <Button
        className={cn("uppercase", className)}
        variant="large"
        type="submit"
      >
        Begin the experience
      </Button>
    </form>
  ) : (
    <CreateUser />
  );
};
