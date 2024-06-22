import { getResults } from "@/api/actions";
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

  const results = await getResults({ userId });

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-4 p-4">
      <Header2>Results</Header2>
      <Suspense fallback={<div>Loading...</div>}>
        <Results results={results} />
      </Suspense>
    </main>
  );
};
