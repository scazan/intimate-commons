import React from "react";
import { Button } from "@/components/base/ui";
import { cookies } from "next/headers";
import { CreateUser } from "..";

export const ChooseUser = () => {
  const userId = cookies().get("userId");
  const userName = cookies().get("userName");

  return userId && userName?.value ? (
    <Button asChild>
      <a href="/questions">Continue as {userName.value}?</a>
    </Button>
  ) : (
    <CreateUser />
  );
};
