import { Header2 } from "@/components";
import { Results } from "@/components/Results";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async () => {
  const { value: userId } = cookies().get("userId");

  if (!userId) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-4 p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <Results userId={userId} />
      </Suspense>
    </main>
  );
};
