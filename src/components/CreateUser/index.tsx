import React from "react";
import { Input, Label, Button } from "../base/ui";
import { createUser } from "@/api/actions";

export default () => {
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
