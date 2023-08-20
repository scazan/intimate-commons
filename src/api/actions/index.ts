import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export const createUser = async (data: FormData) => {
  "use server";

  const formName = data.get("name") || "anonymous";
  const name = formName.valueOf().toString();

  const newUser = await prisma.users.create({
    data: {
      name,
    },
  });

  cookies().set("userId", newUser.id);
  cookies().set("name", newUser.name);

  return { id: newUser.id };
};
