"use client";
import React from "react";
import { CreateUser } from "..";

export const ChooseUser = ({ className }) => {
  // Always show CreateUser form to generate new user ID and ask for new name
  return <CreateUser />;
};
