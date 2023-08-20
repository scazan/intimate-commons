import CreateUser from "@/components/CreateUser";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async () => {
  const userId = cookies().get("userId");

  if (userId) {
    redirect("/questions");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CreateUser />
    </main>
  );
};
