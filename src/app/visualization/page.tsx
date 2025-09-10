import { getResults } from "@/api/actions";
import { Header2 } from "@/components";
import { ResultsViz } from "@/components/Results/ResultsViz";
import { Button } from "@/components/base/ui/button";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

export default async ({ searchParams }) => {
  const userIdCookie = cookies().get("userId");
  const groupIdCookie = cookies().get("groupId");
  
  const userId = userIdCookie?.value;
  const groupId = groupIdCookie?.value;
  const { sid, gid } = searchParams;

  if (!userId) {
    notFound();
  }

  const results = await getResults({
    userId,
    sessionId: sid,
    groupId: gid || groupId,
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Header2>Global</Header2>
        <Link href={`/results?sid=${sid}&gid=${gid || ""}`}>
          <Button variant="default" size="default">
            Back to Results
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading visualization...</div>}>
        <ResultsViz data={results.global} />
      </Suspense>
    </div>
  );
};
