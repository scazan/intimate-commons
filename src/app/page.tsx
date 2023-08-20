import { ChooseUser } from "@/components/User";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ChooseUser />
    </main>
  );
};
