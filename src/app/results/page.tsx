import { getResults } from "@/api/actions";
import { Header2 } from "@/components";
import { Results } from "@/components/Results";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async ({ searchParams }) => {
  const { value: userId } = cookies().get("userId") || {};
  const { value: groupId } = cookies().get("groupId") || {};
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
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Results results={results} />
      </Suspense>
    </>
  );
};
