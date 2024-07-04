import React from "react";
import { Button } from "@/components/base/ui";
import { cookies } from "next/headers";
import { CreateUser } from "..";

export const ChooseUser = ({ className }) => {
  const userId = cookies().get("userId");
  const userName = cookies().get("userName");

  return userId && userName?.value ? (
    <Button asChild className={className} variant="large">
      <a href="/questions" className="uppercase">
        Begin the experience
      </a>
    </Button>
  ) : (
    <CreateUser />
  );
};
