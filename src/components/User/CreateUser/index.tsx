import React from "react";
import { Input, Label, Button } from "@/components/base/ui";
import { createUser } from "@/api/actions";

export const CreateUser = () => {
  return (
    <form action={createUser}>
      <Label>Name:</Label>
      <Input
        id="createUser"
        type="text"
        placeholder="What's your name?"
        name="name"
      />
      <Button type="submit">Start</Button>
    </form>
  );
};
